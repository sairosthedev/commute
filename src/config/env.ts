import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const envPaths = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env")
];

const envPath = envPaths.find((candidate) => fs.existsSync(candidate));

if (envPath) {
  const buffer = fs.readFileSync(envPath);
  let raw = buffer.toString("utf8");
  if (raw.includes("\u0000")) {
    raw = buffer.toString("utf16le");
  }
  raw = raw.replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/);

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    const index = trimmed.indexOf("=");
    if (index === -1) {
      return;
    }

    const key = trimmed
      .slice(0, index)
      .trim()
      .replace(/[\u200B-\u200D\uFEFF]/g, "");
    const value = trimmed.slice(index + 1).trim();

    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  });

  dotenv.config({ path: envPath, override: false });
} else {
  dotenv.config();
}

const required = (name: string, fallback?: string): string => {
  const value = process.env[name] ?? fallback;
  if (!value) {
    const lookedIn = envPaths.join(", ");
    throw new Error(
      `Missing env var: ${name}. Looked for .env in: ${lookedIn}. cwd: ${process.cwd()}`
    );
  }
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGODB_URI"),
  dnsServers: (process.env.DNS_SERVERS ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean),
  redisEnabled: (process.env.REDIS_ENABLED ?? "false").toLowerCase() === "true",
  redisUrl: process.env.REDIS_URL ?? "",
  emailEnabled: (process.env.EMAIL_ENABLED ?? "false").toLowerCase() === "true",
  emailFrom: process.env.EMAIL_FROM ?? "",
  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  fcmEnabled: (process.env.FCM_ENABLED ?? "false").toLowerCase() === "true",
  firebaseServiceAccountJson: process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "",
  jwtSecret: required("JWT_SECRET"),
  corsOrigin: process.env.CORS_ORIGIN ?? "*"
};
