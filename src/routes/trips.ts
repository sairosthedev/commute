import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { listTrips } from "../controllers/tripController";
import { validateQuery } from "../middleware/validateQuery";
import { tripQuerySchema } from "../validation/schemas";

const router = Router();

router.use(requireAuth);

router.get("/trips", validateQuery(tripQuerySchema), listTrips);

export default router;
