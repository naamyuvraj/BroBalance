import type { Request, Response, NextFunction } from 'express';
const FriendService = require('./friend.service');

class FriendController {
  /** GET /api/friend — list accepted friends with balances */
  static async getFriends(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const limit = parseInt(req.query.limit as string) || 0;
      const sort = (req.query.sort as string) || 'recent';

      const friends = await FriendService.getFriends(userId, limit, sort);
      res.json({ success: true, data: friends });
    } catch (error) {
      next(error);
    }
  }

  /** GET /api/friend/requests/pending — pending requests sent to this user */
  static async getPendingRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      const requests = await FriendService.getPendingRequests(userId);
      res.json({ success: true, data: requests });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/friend/request — send a friend request */
  static async sendRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await FriendService.sendRequest(userId, req.body.to);
      res.status(201).json({ success: true, message: 'Request sent' });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/friend/request/:id/accept — accept a pending request */
  static async acceptRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await FriendService.acceptRequest(req.params.id as string, userId);
      res.json({ success: true, message: 'Request accepted' });
    } catch (error) {
      next(error);
    }
  }

  /** POST /api/friend/request/:id/decline — decline a pending request */
  static async declineRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await FriendService.declineRequest(req.params.id as string, userId);
      res.json({ success: true, message: 'Request declined' });
    } catch (error) {
      next(error);
    }
  }

  /** DELETE /api/friend/:id — remove a friend */
  static async removeFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.id;
      await FriendService.removeFriend(req.params.id as string, userId);
      res.json({ success: true, message: 'Friend removed' });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FriendController;
