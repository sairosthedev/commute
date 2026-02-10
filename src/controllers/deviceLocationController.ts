import { Request, Response } from "express";
import { Child } from "../models/Child";
import { LocationEvent } from "../models/LocationEvent";
import { User } from "../models/User";
import { getZone } from "../services/geoService";
import { notify } from "../services/notificationService";

export const createDeviceLocation = async (req: Request, res: Response): Promise<void> => {
  const { lat, lng, recordedAt, source } = req.body as {
    lat?: number;
    lng?: number;
    recordedAt?: string;
    source?: string;
  };

  const childId = req.childId;
  const parentId = req.parentId;

  if (!childId || !parentId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (lat === undefined || lng === undefined) {
    res.status(400).json({ error: "lat and lng are required" });
    return;
  }

  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) {
    res.status(404).json({ error: "Child not found" });
    return;
  }

  const event = await LocationEvent.create({
    childId,
    parentId,
    deviceId: req.deviceId,
    lat,
    lng,
    recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    source: source ?? "device"
  });

  const zone = getZone(
    { lat, lng },
    child.homeGeofence ?? null,
    child.schoolGeofence ?? null
  );

  const lastZone = child.lastZone ?? "unknown";
  const parent = await User.findById(parentId).lean();
  const email = parent?.email;

  if (lastZone !== zone) {
    if (zone !== "outside") {
      await notify({
        userId: parentId,
        childId: child.id,
        type: "arrival",
        message: `${child.name} arrived at ${zone}.`,
        email,
        meta: { zone }
      });
    } else if (lastZone !== "unknown" && lastZone !== "outside") {
      await notify({
        userId: parentId,
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
