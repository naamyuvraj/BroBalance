const mongoose = require('mongoose');
const { Friend } = require('./friend.model');
const { User } = require('../user/user.model');
const { Transaction } = require('../transaction/transaction.model');
const { NotificationService } = require('../notification/notification.service');
const AppError = require('../../utils/AppError');

class FriendService {
  /**
   * Calculate net balance between two users from transactions.
   * Positive = they owe you, negative = you owe them.
   */
  private static async calculateBalance(userId: string, friendId: string): Promise<number> {
    // Transactions where user lent to friend (friend owes user)
    const lentResult = await Transaction.aggregate([
      {
        $match: {
          senderId: new mongoose.Types.ObjectId(userId),
          receiverId: new mongoose.Types.ObjectId(friendId),
          status: { $ne: 'paid' },
        },
      },
      { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } },
    ]);

    // Transactions where friend lent to user (user owes friend)
    const borrowedResult = await Transaction.aggregate([
      {
        $match: {
          senderId: new mongoose.Types.ObjectId(friendId),
          receiverId: new mongoose.Types.ObjectId(userId),
          status: { $ne: 'paid' },
        },
      },
      { $group: { _id: null, total: { $sum: { $subtract: ['$amount', '$paidAmount'] } } } },
    ]);

    const theyOweYou = lentResult[0]?.total ?? 0;
    const youOweThem = borrowedResult[0]?.total ?? 0;

    return theyOweYou - youOweThem;
  }

  /**
   * Get all accepted friends for a user, with balance from transactions.
   * Supports ?limit=N&sort=recent for the dashboard widget.
   */
  static async getFriends(userId: string, limit = 0, sort = 'recent') {
    const query = Friend.find({
      $or: [{ userId }, { friendId: userId }],
      status: 'accepted',
    })
      .sort(sort === 'recent' ? { updatedAt: -1 } : {})
      .populate('userId', 'username email avatarUrl')
      .populate('friendId', 'username email avatarUrl')
      .lean();

    if (limit > 0) query.limit(limit);

    const friends = await query;

    const result = await Promise.all(
      friends.map(async (f: any) => {
        const isUser = f.userId._id.toString() === userId;
        const friendInfo = isUser ? f.friendId : f.userId;
        const balance = await FriendService.calculateBalance(userId, friendInfo._id.toString());
        return {
          _id: friendInfo._id,
          username: friendInfo.username,
          email: friendInfo.email,
          avatarUrl: friendInfo.avatarUrl,
          balance,
        };
      }),
    );

    return result;
  }

  /**
   * Get pending friend requests sent TO this user.
   */
  static async getPendingRequests(userId: string) {
    const requests = await Friend.find({
      friendId: userId,
      status: 'pending',
    })
      .populate('userId', 'username email avatarUrl')
      .lean();

    return requests.map((r: any) => ({
      _id: r._id,
      from: {
        _id: r.userId._id,
        username: r.userId.username,
        email: r.userId.email,
        avatarUrl: r.userId.avatarUrl,
      },
    }));
  }

  /**
   * Send a friend request from one user to another.
   * Throws if self-add, already friends, or request already pending.
   */
  static async sendRequest(fromUserId: string, toUserId: string) {
    if (fromUserId === toUserId) {
      throw new AppError("You can't send a friend request to yourself", 400);
    }

    // check target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      throw new AppError('User not found', 404);
    }

    // check for existing relationship in either direction
    const existing = await Friend.findOne({
      $or: [
        { userId: fromUserId, friendId: toUserId },
        { userId: toUserId, friendId: fromUserId },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        throw new AppError('You are already friends', 400);
      }
      if (existing.status === 'pending') {
        throw new AppError('A friend request already exists', 400);
      }
      // if status was 'rejected', allow re-sending by updating
      existing.userId = new mongoose.Types.ObjectId(fromUserId);
      existing.friendId = new mongoose.Types.ObjectId(toUserId);
      existing.status = 'pending';
      await existing.save();

      // notify target
      const sender = await User.findById(fromUserId);
      await NotificationService.create(toUserId, {
        fromUserId,
        type: 'friend_request',
        title: 'New Connection Request',
        body: `${sender?.username ?? 'Someone'} wants to connect with you`,
        metadata: { friendRequestId: existing._id },
      });

      return existing;
    }

    // create new request
    const request = await Friend.create({
      userId: fromUserId,
      friendId: toUserId,
      status: 'pending',
    });

    // notify target
    const sender = await User.findById(fromUserId);
    await NotificationService.create(toUserId, {
      fromUserId,
      type: 'friend_request',
      title: 'New Connection Request',
      body: `${sender?.username ?? 'Someone'} wants to connect with you`,
      metadata: { friendRequestId: request._id },
    });

    return request;
  }

  /**
   * Accept a pending friend request.
   * Only the recipient (friendId) can accept.
   */
  static async acceptRequest(requestId: string, userId: string) {
    const request = await Friend.findById(requestId);
    if (!request) {
      throw new AppError('Friend request not found', 404);
    }

    if (request.friendId.toString() !== userId) {
      throw new AppError('You can only accept requests sent to you', 403);
    }

    if (request.status !== 'pending') {
      throw new AppError('This request is no longer pending', 400);
    }

    request.status = 'accepted';
    await request.save();

    // notify the original sender that their request was accepted
    const accepter = await User.findById(userId);
    await NotificationService.create(request.userId.toString(), {
      fromUserId: userId,
      type: 'friend_accepted',
      title: 'Request Accepted',
      body: `${accepter?.username ?? 'Someone'} accepted your friend request`,
      metadata: { friendRequestId: request._id },
    });

    return request;
  }

  /**
   * Decline a pending friend request.
   * Only the recipient (friendId) can decline.
   */
  static async declineRequest(requestId: string, userId: string) {
    const request = await Friend.findById(requestId);
    if (!request) {
      throw new AppError('Friend request not found', 404);
    }

    if (request.friendId.toString() !== userId) {
      throw new AppError('You can only decline requests sent to you', 403);
    }

    if (request.status !== 'pending') {
      throw new AppError('This request is no longer pending', 400);
    }

    request.status = 'rejected';
    await request.save();

    return request;
  }

  /**
   * Remove a friend (unfriend). Either user can do this.
   * Deletes the Friend document entirely.
   */
  static async removeFriend(friendUserId: string, currentUserId: string) {
    const result = await Friend.findOneAndDelete({
      $or: [
        { userId: currentUserId, friendId: friendUserId, status: 'accepted' },
        { userId: friendUserId, friendId: currentUserId, status: 'accepted' },
      ],
    });

    if (!result) {
      throw new AppError('Friendship not found', 404);
    }

    return result;
  }
}

module.exports = FriendService;
