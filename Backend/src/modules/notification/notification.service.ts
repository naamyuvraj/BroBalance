const { Notification } = require('./notification.model');
import type { INotificationPayload } from './notification.types';

const NotificationService = {
  async create(userId: string, payload: INotificationPayload) {
    const notification = await Notification.create({ userId, ...payload });
    return notification;
  },

  async getAll(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ userId })
      .sort({ read: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('fromUserId', 'username email avatarUrl')
      .lean();
    const total = await Notification.countDocuments({ userId });
    return { notifications, total, page, limit };
  },

  async getUnreadCount(userId: string) {
    const count = await Notification.countDocuments({ userId, read: false });
    return count;
  },

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
    return notification;
  },

  async markAllAsRead(userId: string) {
    await Notification.updateMany({ userId, read: false }, { read: true });
  },

  async delete(notificationId: string, userId: string) {
    await Notification.findOneAndDelete({ _id: notificationId, userId });
  },
};

module.exports = { NotificationService };
