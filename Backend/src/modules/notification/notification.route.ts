import { Router } from "express";
import { NotificationController } from "./notification.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get("/", NotificationController.getAll);
router.get("/unread-count", NotificationController.getUnreadCount);
router.patch("/read-all", NotificationController.markAllAsRead);
router.patch("/:id/read", NotificationController.markAsRead);
router.delete("/:id", NotificationController.delete);

export default router;
