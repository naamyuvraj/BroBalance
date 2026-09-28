const { Router } = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../../middlewares/auth.middleware');
const FriendController = require('./friend.controller');

const router = Router();

router.use(authMiddleware);

router.get('/', FriendController.getFriends);

router.get('/requests/pending', FriendController.getPendingRequests);

router.post(
  '/request',
  body('to').notEmpty().withMessage('Target user ID is required'),
  FriendController.sendRequest,
);

router.post('/request/:id/accept', FriendController.acceptRequest);
router.post('/request/:id/decline', FriendController.declineRequest);

router.delete('/:id', FriendController.removeFriend);

module.exports = router;
