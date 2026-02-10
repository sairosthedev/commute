import { Request, Response, NextFunction } from "express";
import { Device } from "../models/Device";
import { verifyApiKey } from "../services/deviceService";

export const requireDevice = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const apiKey = req.header("x-device-key") ?? "";
  if (!apiKey) {
    res.status(401).json({ error: "Missing x-device-key" });
    return;
  }

  const prefix = apiKey.split(".")[0];
  if (!prefix) {
    res.status(401).json({ error: "Invalid device key" });
    return;
  }

  const device = await Device.findOne({ apiKeyPrefix: prefix });
  if (!device) {
    res.status(401).json({ error: "Invalid device key" });
    return;
  }

  const valid = await verifyApiKey(apiKey, device.apiKeyHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid device key" });
    return;
  }

  device.lastSeenAt = new Date();
  await device.save();

  req.deviceId = device.id;
  req.childId = device.childId.toString();
  req.parentId = device.parentId.toString();

  next();
};
