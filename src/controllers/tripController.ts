import { Request, Response } from "express";
import { LocationEvent } from "../models/LocationEvent";

export const listTrips = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { childId, start, end, limit } = req.query as {
    childId?: string;
    start?: string;
    end?: string;
    limit?: number;
  };

  const filter: Record<string, unknown> = { parentId: userId };
  if (childId) {
    filter.childId = childId;
  }

  if (start || end) {
    filter.recordedAt = {
      ...(start ? { $gte: new Date(start) } : {}),
      ...(end ? { $lte: new Date(end) } : {})
    };
  }

  const max = typeof limit === "number" ? limit : 100;

  const events = await LocationEvent.find(filter)
    .sort({ recordedAt: -1 })
    .limit(max)
    .lean();

  res.json(events);
};
