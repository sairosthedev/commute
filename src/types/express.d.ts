import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      deviceId?: string;
      childId?: string;
      parentId?: string;
    }
  }
}
