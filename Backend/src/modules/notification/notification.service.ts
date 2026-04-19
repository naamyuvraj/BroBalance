// notification.service.ts — all notification CRUD
//
// the model and types are done, the method signatures are right,
// just need to uncomment the implementation code in each method.
// literally just remove the // before each line and delete the dummy returns.
//
// the create() method is the most important one — its called by:
//   - friend.service.ts → when someone sends/accepts a friend request
//   - transaction.service.ts → when someone creates a transaction
//   - reminder.service.ts → when a reminder fires
//
// hint: all the commented-out code below is correct, just uncomment it

const { Notification } = require('./notification.model');
import type { INotificationPayload } from './notification.types';

/**
 * Create a notification for a user.
 * Call this from other services (friend, transaction, reminder) whenever
 * something notification-worthy happens.
 *
 * Example usage from friend service:
 *   await NotificationService.create(targetUserId, {
 *     fromUserId: senderId,
 *     type: "friend_request",
 *     title: "New Connection Request",
 *     body: `${senderName} wants to connect with you`,
 *     metadata: { friendRequestId: request._id },
 *   });
 */
const NotificationService = {
  async create(userId: string, payload: INotificationPayload) {
    // TODO: Create the notification document in the database
    // const notification = await Notification.create({ userId, ...payload });
    // return notification;
  },

  async getAll(userId: string, page = 1, limit = 20) {
    // TODO: Fetch notifications for this user, sorted by newest first
    // Populate fromUserId with username and avatarUrl
    // Support pagination with skip/limit
    //
    // const skip = (page - 1) * limit;
    // const notifications = await Notification.find({ userId })
    //   .sort({ createdAt: -1 })
    //   .skip(skip)
    //   .limit(limit)
    //   .populate("fromUserId", "username email avatarUrl")
    //   .lean();
    // const total = await Notification.countDocuments({ userId });
    // return { notifications, total, page, limit };
    return { notifications: [], total: 0, page, limit };
  },

  async getUnreadCount(userId: string) {
    // TODO: Count unread notifications for this user
    // const count = await Notification.countDocuments({ userId, read: false });
    // return count;
    return 0;
  },

  async markAsRead(notificationId: string, userId: string) {
    // TODO: Mark a single notification as read (ensure it belongs to this user)
    // const notification = await Notification.findOneAndUpdate(
    //   { _id: notificationId, userId },
    //   { read: true },
    //   { new: true }
    // );
    // return notification;
  },

  async markAllAsRead(userId: string) {
    // TODO: Mark all notifications as read for this user
    // await Notification.updateMany({ userId, read: false }, { read: true });
  },

  async delete(notificationId: string, userId: string) {
    // TODO: Delete a notification (ensure it belongs to this user)
    // await Notification.findOneAndDelete({ _id: notificationId, userId });
  },
};

module.exports = { NotificationService };
