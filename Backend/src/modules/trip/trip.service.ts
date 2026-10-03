const mongoose = require('mongoose');
const { Trip } = require('./trip.model');
const { TripExpense } = require('./tripExpense.model');
const { User } = require('../user/user.model');
const AppError = require('../../utils/AppError');

class TripService {
  static async createTrip(
    userId: string,
    {
      name,
      description,
      category,
      memberIds,
    }: {
      name: string;
      description?: string;
      category?: string;
      memberIds?: string[];
    }
  ) {
    // Unique list of members including creator
    const uniqueMembers = Array.from(
      new Set([userId, ...(memberIds || [])].map((id) => id.toString()))
    );

    const trip = await Trip.create({
      name,
      description: description || '',
      category: category || 'trip',
      creatorId: userId,
      members: uniqueMembers,
    });

    return await Trip.findById(trip._id)
      .populate('creatorId', 'username email avatarUrl')
      .populate('members', 'username email avatarUrl')
      .lean();
  }

  static async getUserTrips(userId: string) {
    const trips = await Trip.find({
      members: new mongoose.Types.ObjectId(userId),
    })
      .sort({ updatedAt: -1 })
      .populate('creatorId', 'username email avatarUrl')
      .populate('members', 'username email avatarUrl')
      .lean();

    // Attach total spend per trip
    const tripsWithStats = await Promise.all(
      trips.map(async (trip: any) => {
        const expenses = await TripExpense.find({ tripId: trip._id }).lean();
        const totalSpend = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
        return {
          ...trip,
          totalSpend,
          expenseCount: expenses.length,
        };
      })
    );

    return tripsWithStats;
  }

  static async getTripDetails(tripId: string, userId: string) {
    const trip = await Trip.findById(tripId)
      .populate('creatorId', 'username email avatarUrl')
      .populate('members', 'username email avatarUrl')
      .lean();

    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    const isMember = trip.members.some(
      (m: any) => m._id.toString() === userId.toString()
    );
    if (!isMember) {
      throw new AppError('You are not a member of this trip', 403);
    }

    const expenses = await TripExpense.find({ tripId })
      .sort({ createdAt: -1 })
      .populate('paidBy', 'username email avatarUrl')
      .populate('splitAmong', 'username email avatarUrl')
      .lean();

    // 1. Calculate per-member totals (paid vs share)
    const memberStats: Record<
      string,
      {
        user: any;
        totalPaid: number;
        totalShare: number;
        netBalance: number;
      }
    > = {};

    trip.members.forEach((m: any) => {
      const mId = m._id.toString();
      memberStats[mId] = {
        user: {
          _id: m._id,
          username: m.username || m.email.split('@')[0],
          email: m.email,
          avatarUrl: m.avatarUrl,
        },
        totalPaid: 0,
        totalShare: 0,
        netBalance: 0,
      };
    });

    let totalTripSpend = 0;

    expenses.forEach((e: any) => {
      totalTripSpend += e.amount;
      const payerId = e.paidBy._id.toString();
      if (memberStats[payerId]) {
        memberStats[payerId].totalPaid += e.amount;
      }

      const splitUsers = e.splitAmong && e.splitAmong.length > 0
        ? e.splitAmong
        : trip.members;

      const perPersonShare = e.amount / splitUsers.length;

      splitUsers.forEach((u: any) => {
        const uId = u._id ? u._id.toString() : u.toString();
        if (memberStats[uId]) {
          memberStats[uId].totalShare += perPersonShare;
        }
      });
    });

    // 2. Compute net balance for each member
    Object.keys(memberStats).forEach((mId) => {
      const stat = memberStats[mId];
      stat.totalPaid = Math.round(stat.totalPaid * 100) / 100;
      stat.totalShare = Math.round(stat.totalShare * 100) / 100;
      stat.netBalance = Math.round((stat.totalPaid - stat.totalShare) * 100) / 100;
    });

    // 3. Greedy Min Cash Flow Algorithm for Shortest Dues Settlement
    const optimizedSettlements = this.calculateOptimizedSettlements(memberStats);

    return {
      trip,
      totalTripSpend,
      expenses,
      memberBalances: Object.values(memberStats),
      optimizedSettlements,
    };
  }

  static calculateOptimizedSettlements(
    memberStats: Record<string, { user: any; netBalance: number }>
  ) {
    const balances: Array<{ user: any; amount: number }> = Object.values(memberStats).map(
      (item) => ({
        user: item.user,
        amount: item.netBalance,
      })
    );

    const settlements: Array<{
      from: any;
      to: any;
      amount: number;
    }> = [];

    let guard = 0;
    while (guard < 100) {
      guard++;

      // Find max debtor (most negative balance) & max creditor (most positive balance)
      balances.sort((a, b) => a.amount - b.amount);

      const maxDebtor = balances[0];
      const maxCreditor = balances[balances.length - 1];

      if (!maxDebtor || !maxCreditor) break;
      if (Math.abs(maxDebtor.amount) < 0.5 && Math.abs(maxCreditor.amount) < 0.5) {
        break; // All debts resolved
      }

      const settleAmount = Math.min(-maxDebtor.amount, maxCreditor.amount);
      const roundedAmount = Math.round(settleAmount * 100) / 100;

      if (roundedAmount > 0) {
        settlements.push({
          from: maxDebtor.user,
          to: maxCreditor.user,
          amount: roundedAmount,
        });

        maxDebtor.amount += roundedAmount;
        maxCreditor.amount -= roundedAmount;
      }
    }

    return settlements;
  }

  static async addExpense(
    userId: string,
    tripId: string,
    {
      description,
      amount,
      paidBy,
      splitAmong,
      category,
      billImageUrl,
    }: {
      description: string;
      amount: number;
      paidBy?: string;
      splitAmong?: string[];
      category?: string;
      billImageUrl?: string;
    }
  ) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    const payerId = paidBy || userId;
    const splitUsers = splitAmong && splitAmong.length > 0 ? splitAmong : trip.members;

    const expense = await TripExpense.create({
      tripId,
      description,
      amount,
      paidBy: payerId,
      splitAmong: splitUsers,
      category: category || 'food',
      billImageUrl: billImageUrl || '',
    });

    return await TripExpense.findById(expense._id)
      .populate('paidBy', 'username email avatarUrl')
      .populate('splitAmong', 'username email avatarUrl')
      .lean();
  }

  static async deleteExpense(userId: string, tripId: string, expenseId: string) {
    const expense = await TripExpense.findOne({ _id: expenseId, tripId });
    if (!expense) {
      throw new AppError('Expense not found', 404);
    }

    await TripExpense.deleteOne({ _id: expenseId });
    return { success: true, message: 'Expense deleted' };
  }

  static async addMemberToTrip(userId: string, tripId: string, newMemberId: string) {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      throw new AppError('Trip not found', 404);
    }

    if (!trip.members.includes(newMemberId)) {
      trip.members.push(newMemberId);
      await trip.save();
    }

    return await Trip.findById(tripId)
      .populate('creatorId', 'username email avatarUrl')
      .populate('members', 'username email avatarUrl')
      .lean();
  }
}

module.exports = TripService;
