import { Schema, model, Types } from "mongoose";

const locationEventSchema = new Schema(
  {
    childId: { type: Types.ObjectId, ref: "Child", required: true },
    parentId: { type: Types.ObjectId, ref: "User", required: true },
    deviceId: { type: Types.ObjectId, ref: "Device" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    recordedAt: { type: Date, required: true },
    source: { type: String, default: "app" }
  },
  { timestamps: true }
);

export const LocationEvent = model("LocationEvent", locationEventSchema);
