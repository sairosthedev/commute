import { Request, Response } from "express";
import { Child } from "../models/Child";
import { Device } from "../models/Device";
import { generateApiKey, hashApiKey } from "../services/deviceService";

export const listDevices = async (req: Request, res: Response): Promise<void> => {
  const devices = await Device.find({ parentId: req.userId }).lean();
  res.json(devices);
};

export const createDevice = async (req: Request, res: Response): Promise<void> => {
  const { name, childId } = req.body as { name?: string; childId?: string };

  if (!name || !childId) {
    res.status(400).json({ error: "name and childId are required" });
    return;
  }

  const child = await Child.findOne({ _id: childId, parentId: req.userId }).lean();
  if (!child) {
    res.status(404).json({ error: "Child not found" });
    return;
  }

  const { apiKey, prefix } = generateApiKey();
  const apiKeyHash = await hashApiKey(apiKey);

  const device = await Device.create({
    name,
    childId,
    parentId: req.userId,
    apiKeyPrefix: prefix,
    apiKeyHash
  });

  res.status(201).json({
    device,
    apiKey
  });
};

export const rotateDeviceKey = async (req: Request, res: Response): Promise<void> => {
  const device = await Device.findOne({ _id: req.params.id, parentId: req.userId });
  if (!device) {
    res.status(404).json({ error: "Device not found" });
    return;
  }

  const { apiKey, prefix } = generateApiKey();
  device.apiKeyPrefix = prefix;
  device.apiKeyHash = await hashApiKey(apiKey);
  await device.save();

  res.json({ device, apiKey });
};
