// transaction.route.ts — wire up transaction endpoints
//
// all routes need authMiddleware
//
// routes to register:
//   GET   /           → TransactionController.getAll
//   POST  /           → TransactionController.create
//   PATCH /:id/pay    → TransactionController.markAsPaid
//
// also need a dashboard stats route. two options:
//   a) add GET /stats here and use it as /api/transaction/stats
//   b) create a separate dashboard route (frontend calls /api/dashboard/stats)
//   → option b is cleaner since stats pulls from multiple collections
//
// validation for create:
//   body('friendId').notEmpty().withMessage('Friend ID is required')
//   body('amount').isFloat({ gt: 0 }).withMessage('Amount must be positive')
//   body('type').isIn(['lent', 'borrowed']).withMessage('Type must be lent or borrowed')
//   body('description').notEmpty().withMessage('Description is required')
//
// references:
//   - notification.route.ts → pattern with router.use(authMiddleware)
//   - friend.route.ts → sibling module
//
// dont forget: register this in routes/index.ts!
//   router.use('/transaction', transactionRoutes);

// import { Router } from 'express';
// import authMiddleware from '../../middlewares/auth.middleware.js';
// import TransactionController from './transaction.controller.js';
