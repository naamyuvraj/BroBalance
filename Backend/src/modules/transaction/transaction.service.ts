// transaction.service.ts — all the money tracking logic
//
// the transaction model is done (transaction.model.ts) with:
//   { senderId, receiverId, amount, paidAmount, description, status }
//   status: 'pending' | 'partial' | 'paid'
//   index on (senderId, receiverId)
//
// methods to implement:
//
//   create(userId, { friendId, amount, type, description })
//     - type comes from frontend as 'lent' or 'borrowed'
//     - if type='lent': senderId=userId, receiverId=friendId (you lent them money)
//     - if type='borrowed': senderId=friendId, receiverId=userId (they lent you money)
//     - verify friendId is actually a friend (status='accepted' in Friend collection)
//     - >>> notify the other person via NotificationService.create() <<<
//     - return the created transaction
//
//   getAll(userId, { friendId?, type?, limit?, sort? })
//     - find transactions where senderId=userId OR receiverId=userId
//     - if friendId filter: also match the other side
//     - if type filter: 'lent' means senderId=userId, 'borrowed' means receiverId=userId
//     - populate the other user's info (username, avatarUrl)
//     - sort by createdAt desc
//     - frontend expects each txn to have:
//       { _id, amount, type ('lent'|'borrowed'), description, createdAt,
//         friendName, to: { username, avatarUrl }, from: { username, avatarUrl } }
//
//   markAsPaid(transactionId, userId, paidAmount?)
//     - find the transaction, verify user is involved
//     - if paidAmount >= amount: status = 'paid'
//     - if paidAmount < amount: status = 'partial', update paidAmount
//     - >>> notify the other person <<<
//     - this is the "mark as paid" feature from idea.md
//
//   getStats(userId)
//     - aggregate toReceive: sum of amount where senderId=userId AND status!='paid'
//     - aggregate toPay: sum of amount where receiverId=userId AND status!='paid'
//     - used by the dashboard stats endpoint
//
// references:
//   - transaction.model.ts → ITransaction interface and schema
//   - friend.model.ts → to verify friendship before creating txn
//   - notification.service.ts → for notifying on create/paid
//   - user.model.ts → for populating user info
//
// frontend calls (from transctions.tsx, AddTransactionModal.tsx, dashboard.tsx):
//   GET  /api/transaction                       → getAll
//   GET  /api/transaction?limit=5&sort=recent   → getAll (dashboard)
//   GET  /api/transaction?friendId=xxx          → getAll (friend detail modal)
//   POST /api/transaction                       → create { friendId, amount, type, description }
//   PATCH /api/transaction/:id/pay              → markAsPaid (not in frontend yet)

// import { Transaction } from './transaction.model.js';
// import { Friend } from '../friend/friend.model.js';
// import { User } from '../user/user.model.js';
// import { NotificationService } from '../notification/notification.service.js';
// import AppError from '../../utils/AppError.js';
