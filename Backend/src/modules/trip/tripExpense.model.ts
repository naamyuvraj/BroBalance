const mongoose = require('mongoose');

const tripExpenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Expense description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    splitAmong: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    category: {
      type: String,
      enum: ['food', 'stay', 'travel', 'activity', 'other'],
      default: 'food',
    },
    billImageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const TripExpense = mongoose.models.TripExpense || mongoose.model('TripExpense', tripExpenseSchema);

module.exports = { TripExpense };
