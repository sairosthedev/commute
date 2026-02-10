import { Router } from "express";
import healthRoutes from "./health";
import authRoutes from "./auth";
import childrenRoutes from "./children";
import locationRoutes from "./locations";
import notificationRoutes from "./notifications";
import deviceRoutes from "./devices";
import deviceLocationRoutes from "./deviceLocations";
import tripRoutes from "./trips";

const router = Router();

router.use(healthRoutes);
router.use(authRoutes);
router.use(childrenRoutes);
router.use(locationRoutes);
router.use(notificationRoutes);
router.use(deviceRoutes);
router.use(deviceLocationRoutes);
router.use(tripRoutes);

export default router;
