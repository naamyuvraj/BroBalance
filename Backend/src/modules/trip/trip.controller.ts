const TripService = require('./trip.service');

class TripController {
  static async createTrip(req: any, res: any, next: any) {
    try {
      const userId = req.user.id;
      const { name, description, category, memberIds } = req.body;
      const trip = await TripService.createTrip(userId, {
        name,
        description,
        category,
        memberIds,
      });
      res.status(201).json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  }

  static async getUserTrips(req: any, res: any, next: any) {
    try {
      const userId = req.user.id;
      const trips = await TripService.getUserTrips(userId);
      res.json({ success: true, data: trips });
    } catch (error) {
      next(error);
    }
  }

  static async getTripDetails(req: any, res: any, next: any) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const details = await TripService.getTripDetails(id, userId);
      res.json({ success: true, data: details });
    } catch (error) {
      next(error);
    }
  }

  static async addExpense(req: any, res: any, next: any) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { description, amount, paidBy, splitAmong, category, billImageUrl } = req.body;
      const expense = await TripService.addExpense(userId, id, {
        description,
        amount: Number(amount),
        paidBy,
        splitAmong,
        category,
        billImageUrl,
      });
      res.status(201).json({ success: true, data: expense });
    } catch (error) {
      next(error);
    }
  }

  static async deleteExpense(req: any, res: any, next: any) {
    try {
      const userId = req.user.id;
      const { id, expenseId } = req.params;
      const result = await TripService.deleteExpense(userId, id, expenseId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async addMember(req: any, res: any, next: any) {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { memberId } = req.body;
      const trip = await TripService.addMemberToTrip(userId, id, memberId);
      res.json({ success: true, data: trip });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
