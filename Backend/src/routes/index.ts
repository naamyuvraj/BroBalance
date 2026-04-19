// routes/index.ts — central route registry
//
// currently only auth, user, and notification are registered
// friend, transaction, and reminder are MISSING
//
// once those modules are built, add:
//   import friendRoutes from '../modules/friend/friend.route.js';
//   import transactionRoutes from '../modules/transaction/transaction.route.js';
//   import reminderRoutes from '../modules/reminder/reminder.route.js';
//   router.use('/friend', friendRoutes);
//   router.use('/transaction', transactionRoutes);
//   router.use('/reminder', reminderRoutes);
//
// also might need a dashboard route:
//   GET /api/dashboard/stats → pulls from Friend + Transaction collections
//   could either be its own module or a route on the transaction module
//   frontend (dashboard.tsx) calls: GET /api/dashboard/stats
//   expects: { totalFriends, toReceive, toPay }

const { Router } = require('express');
const authRoutes = require('../modules/auth/auth.route');
const userRoutes = require('../modules/user/user.route');
const notificationRoutes = require('../modules/notification/notification.route');
const newsletterRoutes = require('../modules/newsletter/newsletter.route');
const friendRoutes = require('../modules/friend/friend.route');

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/notification', notificationRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/friend', friendRoutes);

module.exports = router;
