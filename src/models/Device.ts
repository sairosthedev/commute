import { Schema, model, Types } from "mongoose";

const deviceSchema = new Schema(
  {
    name: { type: String, required: true },
    parentId: { type: Types.ObjectId, ref: "User", required: true },
    childId: { type: Types.ObjectId, ref: "Child", required: true },
    apiKeyPrefix: { type: String, required: true, unique: true },
    apiKeyHash: { type: String, required: true },
    lastSeenAt: { type: Date }
  },
  { timestamps: true }
);

export const Device = model("Device", deviceSchema);
