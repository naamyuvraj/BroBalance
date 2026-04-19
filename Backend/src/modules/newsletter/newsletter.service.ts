const Subscriber = require('./newsletter.model');
import type { ISubscriberDocument } from './newsletter.model';

// add a new subscriber
const subscribe = async (email: string): Promise<ISubscriberDocument> => {
  const existing = await Subscriber.findOne({ email: email.toLowerCase() });
  if (existing) {
    if (!existing.active) {
      existing.active = true;
      await existing.save();
    }
    return existing;
  }
  return Subscriber.create({ email: email.toLowerCase() });
};

// unsubscribe
const unsubscribe = async (email: string): Promise<void> => {
  await Subscriber.updateOne({ email: email.toLowerCase() }, { active: false });
};

// get all active subscribers
const getActiveSubscribers = async (): Promise<ISubscriberDocument[]> => {
  return Subscriber.find({ active: true }).sort({ subscribedAt: -1 });
};

// get subscriber count
const getSubscriberCount = async (): Promise<number> => {
  return Subscriber.countDocuments({ active: true });
};

module.exports = { subscribe, unsubscribe, getActiveSubscribers, getSubscriberCount };
