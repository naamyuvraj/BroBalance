// notification.controller.ts — express handlers for notifications
//
// BUG: the import below is commented out, so getUnreadCount, markAsRead,
// markAllAsRead, and delete all fail because Request/Response/NextFunction
// are undefined. getAll only works because it uses `any` types.
//
// FIX: uncomment the import and remove the `any` types from getAll too
// or better yet, add proper types for all handlers
//
// once friend/transaction services are built, notifications will actually
// have data to show. until then these work but return empty results.

import type { Request, Response, NextFunction } from 'express';
const { NotificationService } = require('./notification.service');

const NotificationController = {
  /** GET /api/notification */
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

  /** GET /api/notification/unread-count */
  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const count = await NotificationService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (err) {
      next(err);
    }
  },

  /** PATCH /api/notification/:id/read */
  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await NotificationService.markAsRead(req.params.id as string, userId);
      res.json({ success: true, message: "Marked as read" });
    } catch (err) {
      next(err);
    }
  },

  /** PATCH /api/notification/read-all */
  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await NotificationService.markAllAsRead(userId);
      res.json({ success: true, message: "All marked as read" });
    } catch (err) {
      next(err);
    }
  },

  /** DELETE /api/notification/:id */
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
