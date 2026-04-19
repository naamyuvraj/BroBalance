const { Router } = require('express');
const authMiddleware = require('../../middlewares/auth.middleware');
const UserController = require('./user.controller');

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);
router.put('/me', authMiddleware, UserController.updateMe);

module.exports = router;
