import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createDevice, listDevices, rotateDeviceKey } from "../controllers/deviceController";
import { validateBody } from "../middleware/validateBody";
import { deviceCreateSchema } from "../validation/schemas";

const router = Router();

router.use(requireAuth);

router.get("/devices", listDevices);
router.post("/devices", validateBody(deviceCreateSchema), createDevice);
router.post("/devices/:id/rotate", rotateDeviceKey);

export default router;
