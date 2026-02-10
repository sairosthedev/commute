import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateQuery = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        error: "Validation failed",
        details: result.error.flatten()
      });
      return;
    }

    req.query = result.data as typeof req.query;
    next();
  };
