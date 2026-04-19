import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  amount: number;
  paidAmount: number;
  description: string;
  status: "pending" | "partial" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema<ITransaction>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid"],
      default: "pending",
    },
  },
  { timestamps: true }
);

TransactionSchema.index({ senderId: 1, receiverId: 1 });

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  TransactionSchema
);

module.exports = { Transaction };