// reminder.route.ts — wire up reminder endpoints
//
// all routes need authMiddleware
//
// routes to register:
//   POST /             → ReminderController.create
//   GET  /received     → ReminderController.getMyReminders
//   GET  /sent         → ReminderController.getSentReminders
//   PATCH /:id/cancel  → ReminderController.cancel
//
// validation for create:
//   body('transactionId').notEmpty()
//   body('message').optional().isString()
//   body('scheduledAt').optional().isISO8601()
//
// note: no frontend pages call these yet
// the frontend reminder UI doesn't exist, but the backend
// should be ready for when it does
//
// references:
//   - notification.route.ts → pattern to follow
//   - friend.route.ts → another sibling pattern
//
// dont forget: register this in routes/index.ts!
//   router.use('/reminder', reminderRoutes);

// import { Router } from 'express';
// import authMiddleware from '../../middlewares/auth.middleware.js';
// import ReminderController from './reminder.controller.js';
