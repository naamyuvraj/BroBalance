import type { Request, Response, NextFunction } from 'express';
const newsletterService = require('./newsletter.service');

// POST /api/newsletter/subscribe
const subscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }
    // basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ success: false, message: 'Invalid email format' });
      return;
    }
    const subscriber = await newsletterService.subscribe(email);
    res.status(201).json({ success: true, message: 'Subscribed successfully', data: { email: subscriber.email } });
  } catch (error) {
    next(error);
  }
};

// POST /api/newsletter/unsubscribe
const unsubscribe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }
    await newsletterService.unsubscribe(email);
    res.status(200).json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    next(error);
  }
};

// GET /api/newsletter/subscribers
const getSubscribers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const subscribers = await newsletterService.getActiveSubscribers();
    const count = await newsletterService.getSubscriberCount();
    res.status(200).json({ success: true, data: { count, subscribers } });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, unsubscribe, getSubscribers };
