import crypto from "crypto";
import bcrypt from "bcryptjs";

const prefixLength = 8;

export const generateApiKey = (): { apiKey: string; prefix: string } => {
  const prefix = crypto.randomBytes(prefixLength / 2).toString("hex");
  const secret = crypto.randomBytes(24).toString("hex");
  return { apiKey: `${prefix}.${secret}`, prefix };
};

export const hashApiKey = async (apiKey: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(apiKey, salt);
};

export const verifyApiKey = async (apiKey: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(apiKey, hash);
};
