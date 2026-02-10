import { Schema, model, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    childId: { type: Types.ObjectId, ref: "Child", required: true },
    type: { type: String, required: true },
    channel: { type: String, default: "in_app" },
    message: { type: String, required: true },
    sentAt: { type: Date },
    meta: { type: Object }
  },
  { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);
