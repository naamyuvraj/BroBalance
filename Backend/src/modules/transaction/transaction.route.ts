const { Router } = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const TransactionController = require('./transaction.controller');

const router = Router();

router.use(authMiddleware);

router.get('/', TransactionController.getAll);
router.post('/', TransactionController.create);
router.patch('/:id/pay', TransactionController.markAsPaid);
router.get('/stats', TransactionController.getStats);

module.exports = router;