import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;      // who receives this notification
  fromUserId: mongoose.Types.ObjectId;  // who triggered it
  type: "friend_request" | "friend_accepted" | "transaction_request" | "transaction_paid" | "reminder" | "message";
  title: string;
  body: string;
  metadata: Record<string, any>;        // flexible payload (friendRequestId, transactionId, etc.)
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["friend_request", "friend_accepted", "transaction_request", "transaction_paid", "reminder", "message"],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast "unread for user" queries
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
