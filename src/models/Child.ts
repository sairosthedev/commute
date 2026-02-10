import { Schema, model, Types } from "mongoose";

const geoSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    radiusMeters: { type: Number, required: true }
  },
  { _id: false }
);

const childSchema = new Schema(
  {
    name: { type: String, required: true },
    parentId: { type: Types.ObjectId, ref: "User", required: true },
    homeGeofence: { type: geoSchema, required: false },
    schoolGeofence: { type: geoSchema, required: false },
    lastZone: { type: String, default: "unknown" },
    lastZoneAt: { type: Date }
  },
  { timestamps: true }
);

export const Child = model("Child", childSchema);
