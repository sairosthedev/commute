import { Request, Response } from "express";
import { Child } from "../models/Child";
import { LocationEvent } from "../models/LocationEvent";
import { User } from "../models/User";
import { getZone } from "../services/geoService";
import { notify } from "../services/notificationService";

export const createLocation = async (req: Request, res: Response): Promise<void> => {
  const { childId, lat, lng, recordedAt, source } = req.body as {
    childId?: string;
    lat?: number;
    lng?: number;
    recordedAt?: string;
    source?: string;
  };

  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (!childId || lat === undefined || lng === undefined) {
    res.status(400).json({ error: "childId, lat, lng are required" });
    return;
  }

  const child = await Child.findOne({ _id: childId, parentId: userId });
  if (!child) {
    res.status(404).json({ error: "Child not found" });
    return;
  }

  const event = await LocationEvent.create({
    childId,
    parentId: userId,
    lat,
    lng,
    recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    source: source ?? "app"
  });

  const zone = getZone(
    { lat, lng },
    child.homeGeofence ?? null,
    child.schoolGeofence ?? null
  );

  const lastZone = child.lastZone ?? "unknown";
  const parent = await User.findById(userId).lean();
  const email = parent?.email;

  if (lastZone !== zone) {
    if (zone !== "outside") {
      await notify({
        userId,
        childId: child.id,
        type: "arrival",
        message: `${child.name} arrived at ${zone}.`,
        email,
        meta: { zone }
      });
    } else if (lastZone !== "unknown" && lastZone !== "outside") {
      await notify({
        userId,
        childId: child.id,
        type: "departure",
        message: `${child.name} left ${lastZone}.`,
        email,
        meta: { zone: lastZone }
      });
    }
  }

  child.lastZone = zone;
  child.lastZoneAt = new Date();
  await child.save();

  res.status(201).json({ event, zone });
};
