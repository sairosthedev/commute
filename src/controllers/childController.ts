import { Request, Response } from "express";
import { Child } from "../models/Child";

export const listChildren = async (req: Request, res: Response): Promise<void> => {
  const children = await Child.find({ parentId: req.userId }).lean();
  res.json(children);
};

export const getChild = async (req: Request, res: Response): Promise<void> => {
  const child = await Child.findOne({ _id: req.params.id, parentId: req.userId }).lean();
  if (!child) {
    res.status(404).json({ error: "Child not found" });
    return;
  }
  res.json(child);
};

export const createChild = async (req: Request, res: Response): Promise<void> => {
  const { name, homeGeofence, schoolGeofence } = req.body as {
    name?: string;
    homeGeofence?: { lat: number; lng: number; radiusMeters: number };
    schoolGeofence?: { lat: number; lng: number; radiusMeters: number };
  };

  if (!name) {
    res.status(400).json({ error: "Child name is required" });
    return;
  }

  const child = await Child.create({
    name,
    parentId: req.userId,
    homeGeofence,
    schoolGeofence
  });

  res.status(201).json(child);
};
