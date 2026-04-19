// reminder.controller.ts — express handlers for reminder routes
//
// handlers needed:
//
//   create(req, res, next)
//     - reads req.body: { transactionId, message?, scheduledAt? }
//     - calls service.create(req.user.id, req.body)
//     - returns { success: true, data: reminder } with 201
//
//   getMyReminders(req, res, next)
//     - calls service.getMyReminders(req.user.id)
//     - returns { success: true, data: reminders }
//
//   getSentReminders(req, res, next)
//     - calls service.getSentReminders(req.user.id)
//     - returns { success: true, data: reminders }
//
//   cancel(req, res, next)
//     - reads req.params.id
//     - calls service.cancel(req.params.id, req.user.id)
//     - returns { success: true, message: 'Reminder cancelled' }
//
// references:
//   - user.controller.ts → pattern to follow
//   - reminder.service.ts → service methods

// import ReminderService from './reminder.service.js';
