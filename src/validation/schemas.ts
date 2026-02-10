import { z } from "zod";

const geofenceSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  radiusMeters: z.number().positive()
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const childCreateSchema = z.object({
  name: z.string().min(1),
  homeGeofence: geofenceSchema.optional(),
  schoolGeofence: geofenceSchema.optional()
});

export const locationCreateSchema = z.object({
  childId: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  recordedAt: z.string().datetime().optional(),
  source: z.string().optional()
});

export const deviceCreateSchema = z.object({
  name: z.string().min(1),
  childId: z.string().min(1)
});

export const deviceLocationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  recordedAt: z.string().datetime().optional(),
  source: z.string().optional()
});

export const tripQuerySchema = z.object({
  childId: z.string().min(1).optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  limit: z.preprocess(
    (value) => (value === undefined ? undefined : Number(value)),
    z.number().int().min(1).max(500).optional()
  )
});

export const fcmTokenSchema = z.object({
  token: z.string().min(10)
});

export const testEmailSchema = z.object({
  message: z.string().min(1).optional()
});
