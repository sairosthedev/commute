import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ error: "Missing Authorization header" });
    return;
  }

  const token = header.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const userId = payload.userId as string | undefined;
    if (!userId) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
