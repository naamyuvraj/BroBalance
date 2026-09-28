const Subscriber = require('./newsletter.model');
import type { ISubscriberDocument } from './newsletter.model';

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

const unsubscribe = async (email: string): Promise<void> => {
  await Subscriber.updateOne({ email: email.toLowerCase() }, { active: false });
};

const getActiveSubscribers = async (): Promise<ISubscriberDocument[]> => {
  return Subscriber.find({ active: true }).sort({ subscribedAt: -1 });
};

const getSubscriberCount = async (): Promise<number> => {
  return Subscriber.countDocuments({ active: true });
};

module.exports = { subscribe, unsubscribe, getActiveSubscribers, getSubscriberCount };
