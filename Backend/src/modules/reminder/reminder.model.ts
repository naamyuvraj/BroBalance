// reminder.model.ts — schema for payment reminders
//
// this is the nudge feature from idea.md:
//   "send a gentle reminder to your friend to pay up"
//
// schema design:
//   ReminderSchema {
//     transactionId: ObjectId (ref Transaction, required)
//     fromUserId: ObjectId    (ref User, required) — who sent the reminder
//     toUserId: ObjectId      (ref User, required) — who needs to pay
//     message: String         — optional custom message ("hey pay me back for pizza")
//     scheduledAt: Date       — when to send (could be immediate or scheduled)
//     sentAt: Date            — when it was actually sent
//     status: String          — 'pending' | 'sent' | 'cancelled'
//     createdAt, updatedAt    — via timestamps: true
//   }
//
// indexes:
//   { toUserId: 1, status: 1 }   — for fetching pending reminders for a user
//   { scheduledAt: 1 }           — for the scheduler to find due reminders
//
// question: do we want recurring reminders?
//   if yes, add: repeatInterval ('daily'|'weekly'|'none'), lastSentAt
//   if no, keep it simple with one-shot reminders
//
// references:
//   - transaction.model.ts → ITransaction, the thing being reminded about
//   - notification.model.ts → when reminder fires, create a notification too
//   - idea.md → nudge / reminder feature description

// import mongoose, { Schema, Document } from 'mongoose';
