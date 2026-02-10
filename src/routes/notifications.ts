import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
	listNotifications,
	registerFcmToken,
	removeFcmToken,
	sendTestEmail
} from "../controllers/notificationController";
import { validateBody } from "../middleware/validateBody";
import { fcmTokenSchema, testEmailSchema } from "../validation/schemas";

const router = Router();

router.use(requireAuth);

router.get("/notifications", listNotifications);
router.post("/notifications/tokens", validateBody(fcmTokenSchema), registerFcmToken);
router.delete("/notifications/tokens", validateBody(fcmTokenSchema), removeFcmToken);
router.post("/notifications/test-email", validateBody(testEmailSchema), sendTestEmail);

export default router;
