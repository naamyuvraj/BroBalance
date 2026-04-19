// import { Request, Response, NextFunction } from "express";
import { NotificationService } from "./notification.service.js";

export const NotificationController = {
  /** GET /api/notification */
  async getAll(req: any, res: any, next: any) {
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
      await NotificationService.markAsRead(req.params.id, userId);
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
      await NotificationService.delete(req.params.id, userId);
      res.json({ success: true, message: "Notification deleted" });
    } catch (err) {
      next(err);
    }
  },
};
