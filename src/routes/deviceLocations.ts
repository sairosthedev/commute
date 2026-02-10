import { Router } from "express";
import { requireDevice } from "../middleware/deviceAuth";
import { createDeviceLocation } from "../controllers/deviceLocationController";
import { validateBody } from "../middleware/validateBody";
import { deviceLocationSchema } from "../validation/schemas";

const router = Router();

router.use(requireDevice);

router.post("/device/locations", validateBody(deviceLocationSchema), createDeviceLocation);

export default router;
