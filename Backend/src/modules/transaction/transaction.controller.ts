// transaction.controller.ts — express handlers for transaction routes
//
// same pattern as user.controller.ts / friend.controller.ts
//
// handlers needed:
//
//   getAll(req, res, next)
//     - reads req.query: { friendId?, type?, limit?, sort? }
//     - calls service.getAll(req.user.id, filters)
//     - returns { success: true, data: transactions }
//
//   create(req, res, next)
//     - reads req.body: { friendId, amount, type, description }
//     - calls service.create(req.user.id, req.body)
//     - returns { success: true, data: transaction } with 201 status
//
//   markAsPaid(req, res, next)
//     - reads req.params.id and optionally req.body.paidAmount
//     - calls service.markAsPaid(req.params.id, req.user.id, paidAmount)
//     - returns { success: true, message: 'Transaction updated' }
//
//   getStats(req, res, next)
//     - calls service.getStats(req.user.id)
//     - returns { success: true, data: { totalFriends, toReceive, toPay } }
//     - note: totalFriends comes from Friend collection, not Transaction
//       so either call FriendService or count here
//
// references:
//   - user.controller.ts → pattern to follow
//   - transaction.service.ts → the service methods

// import TransactionService from './transaction.service.js';
