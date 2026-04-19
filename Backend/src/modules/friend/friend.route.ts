const { Router } = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../../middlewares/auth.middleware');
const FriendController = require('./friend.controller');

const router = Router();

// all friend routes require authentication
router.use(authMiddleware);

// list accepted friends
router.get('/', FriendController.getFriends);

// pending requests (must be before /:id routes)
router.get('/requests/pending', FriendController.getPendingRequests);

// send a friend request
router.post(
  '/request',
  body('to').notEmpty().withMessage('Target user ID is required'),
  FriendController.sendRequest,
);

// accept / decline a request
router.post('/request/:id/accept', FriendController.acceptRequest);
router.post('/request/:id/decline', FriendController.declineRequest);

// remove a friend
router.delete('/:id', FriendController.removeFriend);

module.exports = router;
