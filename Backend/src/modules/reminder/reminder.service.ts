// reminder.service.ts — reminder logic
//
// methods to implement:
//
//   create(fromUserId, { transactionId, message, scheduledAt? })
//     - verify the transaction exists and fromUserId is the lender
//     - verify the transaction isn't already paid
//     - create a Reminder doc with status 'pending'
//     - if no scheduledAt, send immediately (status='sent', sentAt=now)
//     - >>> create a notification for the borrower <<<
//     - return the reminder
//
//   getMyReminders(userId)
//     - find reminders where toUserId = userId
//     - populate transaction info (amount, description) and fromUser (username)
//     - sort by createdAt desc
//
//   getSentReminders(userId)
//     - find reminders where fromUserId = userId
//     - shows the user what reminders they've sent
//
//   cancel(reminderId, userId)
//     - find the reminder, verify fromUserId = userId
//     - set status = 'cancelled'
//
//   processScheduledReminders() — called by a cron job or scheduler
//     - find all reminders where status='pending' AND scheduledAt <= now
//     - for each: set status='sent', sentAt=now, create notification
//     - hint: this could be a static method or a separate job file
//
// references:
//   - reminder.model.ts → the Reminder schema (build this first)
//   - transaction.model.ts → to verify the transaction
//   - notification.service.ts → to send the actual notification
//   - friend.service.ts → similar CRUD pattern to follow

// import { Reminder } from './reminder.model.js';
// import { Transaction } from '../transaction/transaction.model.js';
// import { NotificationService } from '../notification/notification.service.js';
// import AppError from '../../utils/AppError.js';
