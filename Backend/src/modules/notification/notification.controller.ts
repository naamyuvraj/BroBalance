import type { Request, Response, NextFunction } from 'express';
const { NotificationService } = require('./notification.service');

const NotificationController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const data = await NotificationService.getAll(userId, page, limit);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (err) {
      next(err);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await NotificationService.markAsRead(req.params.id as string, userId);
      res.json({ success: true, message: "Marked as read" });
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await NotificationService.markAllAsRead(userId);
      res.json({ success: true, message: "All marked as read" });
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await NotificationService.delete(req.params.id as string, userId);
      res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { NotificationController };
