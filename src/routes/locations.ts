import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createLocation } from "../controllers/locationController";
import { validateBody } from "../middleware/validateBody";
import { locationCreateSchema } from "../validation/schemas";

const router = Router();

router.use(requireAuth);

router.post("/locations", validateBody(locationCreateSchema), createLocation);

export default router;
