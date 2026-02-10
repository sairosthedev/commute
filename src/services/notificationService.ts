import nodemailer from "nodemailer";
import admin from "firebase-admin";
import { env } from "../config/env";
import { Notification } from "../models/Notification";
import { User } from "../models/User";

type NotifyInput = {
  userId: string;
  childId: string;
  type: string;
  message: string;
  email?: string;
  meta?: Record<string, unknown>;
};

const buildTransporter = () => {
  if (!env.emailEnabled || !env.smtpHost || !env.smtpUser) {
    return null;
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpPort === 465,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });
};

const getFirebaseApp = (): admin.app.App | null => {
  if (!env.fcmEnabled || !env.firebaseServiceAccountJson) {
    return null;
  }

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const serviceAccount = JSON.parse(env.firebaseServiceAccountJson);
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
};

export const notify = async (input: NotifyInput): Promise<void> => {
  const record = await Notification.create({
    userId: input.userId,
    childId: input.childId,
    type: input.type,
    message: input.message,
    meta: input.meta,
    channel: env.emailEnabled ? "email" : "in_app"
  });

  if (!env.emailEnabled || !input.email) {
    // fall through for optional FCM
  } else {
    const transporter = buildTransporter();
    if (!transporter) {
      console.warn("Email enabled but SMTP not configured; skipping send");
    } else {
      await transporter.sendMail({
        from: env.emailFrom || env.smtpUser,
        to: input.email,
        subject: input.type,
        text: input.message
      });

      record.sentAt = new Date();
      await record.save();
    }
  }

  if (!env.fcmEnabled) {
    return;
  }

  const app = getFirebaseApp();
  if (!app) {
    console.warn("FCM enabled but service account not configured");
    return;
  }

  const user = await User.findById(input.userId).lean();
  const tokens = user?.fcmTokens ?? [];
  if (tokens.length === 0) {
    return;
  }

  try {
    await admin.messaging().sendEachForMulticast({
      tokens,
      notification: {
        title: input.type,
        body: input.message
      },
      data: {
        childId: input.childId,
        type: input.type
      }
    });
  } catch (err) {
    console.error("Failed to send FCM notification", err);
  }
};
