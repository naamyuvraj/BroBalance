const mongoose = require('mongoose');
const { Transaction } = require('./transaction.model');
const { Friend } = require('../friend/friend.model');
const { User } = require('../user/user.model');
const { NotificationService } = require('../notification/notification.service');
const AppError = require('../../utils/AppError');

class TransactionService {

  static async create(
    userId: string,
    { friendId, amount, type, description }: {
      friendId: string;
      amount: number;
      type: 'lent' | 'borrowed';
      description: string;
    }
  ) {
    let senderId: string;
    let receiverId: string;

    if (type === 'lent') {
      senderId = userId;
      receiverId = friendId;
    } else {
      senderId = friendId;
      receiverId = userId;
    }

    const friendship = await Friend.findOne({
      $or: [
        { userId, friendId, status: 'accepted' },
        { userId: friendId, friendId: userId, status: 'accepted' },
      ],
    });

    if (!friendship) {
      throw new AppError('You can only create transactions with friends', 400);
    }

    const transaction = await Transaction.create({
      senderId,
      receiverId,
      amount,
      description,
    });

    const currentUser = await User.findById(userId);
    await NotificationService.create(friendId, {
      fromUserId: userId,
      type: 'transaction_request',
      title: 'New Transaction',
      body: `${currentUser?.username ?? 'Someone'} recorded a ₹${amount} transaction: ${description}`,
      metadata: { transactionId: transaction._id },
    });

    return transaction;
  }

  static async getAll(
    userId: string,
    filters: { friendId?: string; limit?: number; sort?: string }
  ) {
    const filter: any = {
      $or: [
        { senderId: new mongoose.Types.ObjectId(userId) },
        { receiverId: new mongoose.Types.ObjectId(userId) },
      ],
    };

    if (filters.friendId) {
      filter.$or = [
        {
          senderId: new mongoose.Types.ObjectId(userId),
          receiverId: new mongoose.Types.ObjectId(filters.friendId),
        },
        {
          senderId: new mongoose.Types.ObjectId(filters.friendId),
          receiverId: new mongoose.Types.ObjectId(userId),
        },
      ];
    }

    const query = Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate('senderId', 'username email avatarUrl')
      .populate('receiverId', 'username email avatarUrl')
      .lean();

    if (filters.limit && filters.limit > 0) {
      query.limit(filters.limit);
    }

    const transactions = await query;

    const result = transactions.map((txn: any) => {
      const isLender = txn.senderId._id.toString() === userId;

      return {
        _id: txn._id,
        amount: txn.amount,
        paidAmount: txn.paidAmount,
        description: txn.description,
        status: txn.status,
        createdAt: txn.createdAt,
        type: isLender ? 'lent' : 'borrowed',
        from: {
          _id: txn.senderId._id,
          username: txn.senderId.username,
          avatarUrl: txn.senderId.avatarUrl,
        },
        to: {
          _id: txn.receiverId._id,
          username: txn.receiverId.username,
          avatarUrl: txn.receiverId.avatarUrl,
        },
        friendName: isLender
          ? txn.receiverId.username
          : txn.senderId.username,
      };
    });

    return result;
  }

  static async markAsPaid(transactionId: string, userId: string, paidAmount?: number) {
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    const isSender = transaction.senderId.toString() === userId;
    const isReceiver = transaction.receiverId.toString() === userId;

    if (!isSender && !isReceiver) {
      throw new AppError('You are not part of this transaction', 403);
    }

    if (transaction.status === 'paid') {
      throw new AppError('This transaction is already fully paid', 400);
    }

    const amountToPay = paidAmount ?? (transaction.amount - transaction.paidAmount);
    const newPaidAmount = transaction.paidAmount + amountToPay;

    if (newPaidAmount > transaction.amount) {
      throw new AppError('Payment exceeds remaining amount', 400);
    }

    transaction.paidAmount = newPaidAmount;
    transaction.status = newPaidAmount >= transaction.amount ? 'paid' : 'partial';
    await transaction.save();

    const otherUserId = isSender
      ? transaction.receiverId.toString()
      : transaction.senderId.toString();
    const payer = await User.findById(userId);

    await NotificationService.create(otherUserId, {
      fromUserId: userId,
      type: 'transaction_paid',
      title: 'Payment Update',
      body: `${payer?.username ?? 'Someone'} marked ₹${amountToPay} as paid`,
      metadata: { transactionId: transaction._id },
    });

    return transaction;
  }

  static async getStats(userId: string) {
    const toReceiveResult = await Transaction.aggregate([
      {
        $match: {
          senderId: new mongoose.Types.ObjectId(userId),
          status: { $ne: 'paid' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$amount', '$paidAmount'] } },
        },
      },
    ]);

    const toPayResult = await Transaction.aggregate([
      {
        $match: {
          receiverId: new mongoose.Types.ObjectId(userId),
          status: { $ne: 'paid' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $subtract: ['$amount', '$paidAmount'] } },
        },
      },
    ]);

    const totalFriends = await Friend.countDocuments({
      $or: [{ userId }, { friendId: userId }],
      status: 'accepted',
    });

    return {
      toReceive: toReceiveResult[0]?.total ?? 0,
      toPay: toPayResult[0]?.total ?? 0,
      totalFriends,
    };
  }
}

module.exports = TransactionService;