const { Router } = require('express');
const authRoutes = require('../modules/auth/auth.route');
const userRoutes = require('../modules/user/user.route');
const notificationRoutes = require('../modules/notification/notification.route');
const newsletterRoutes = require('../modules/newsletter/newsletter.route');
const friendRoutes = require('../modules/friend/friend.route');
const transactionRoutes = require('../modules/transaction/transaction.route');
const authMiddleware = require('../middlewares/auth.middleware');
const TransactionService = require('../modules/transaction/transaction.service');

const router = Router();


router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/notification', notificationRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/friend', friendRoutes);
router.use('/transaction', transactionRoutes);

router.get('/dashboard/stats', authMiddleware, async (req: any, res: any, next: any) => {
  try {
    const stats = await TransactionService.getStats(req.user.id);
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
