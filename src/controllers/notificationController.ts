import { Request, Response } from "express";
import { Notification } from "../models/Notification";
import { User } from "../models/User";
import { notify } from "../services/notificationService";

export const listNotifications = async (req: Request, res: Response): Promise<void> => {
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json(notifications);
};

export const registerFcmToken = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { token } = req.body as { token: string };
  await User.updateOne(
    { _id: userId },
    { $addToSet: { fcmTokens: token } }
  );

  res.status(204).send();
};

export const removeFcmToken = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { token } = req.body as { token: string };
  await User.updateOne(
    { _id: userId },
    { $pull: { fcmTokens: token } }
  );

  res.status(204).send();
};

export const sendTestEmail = async (req: Request, res: Response): Promise<void> => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const { message } = req.body as { message?: string };
  const user = await User.findById(userId).lean();
  if (!user?.email) {
    res.status(400).json({ error: "User email not found" });
    return;
  }

  await notify({
    userId,
    childId: "000000000000000000000000",
    type: "test_email",
    message: message ?? "Test email from Commute Tracking Backend",
    email: user.email,
    meta: { test: true }
  });

  res.status(202).json({ status: "queued" });
};
