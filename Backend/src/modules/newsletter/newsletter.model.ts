import mongoose, { Schema, Document } from 'mongoose';
import type { ISubscriber } from './newsletter.types';

export interface ISubscriberDocument extends ISubscriber, Document {}

const subscriberSchema = new Schema<ISubscriberDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model<ISubscriberDocument>('Subscriber', subscriberSchema);
