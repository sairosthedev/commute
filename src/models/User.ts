import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    fcmTokens: { type: [String], default: [] }
  },
  { timestamps: true }
);

export const User = model("User", userSchema);
