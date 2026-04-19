const { Router } = require('express');
const { NotificationController } = require('./notification.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", NotificationController.getAll);
router.get("/unread-count", NotificationController.getUnreadCount);
router.patch("/read-all", NotificationController.markAllAsRead);
router.patch("/:id/read", NotificationController.markAsRead);
router.delete("/:id", NotificationController.delete);

module.exports = router;
