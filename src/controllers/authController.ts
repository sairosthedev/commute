import { Request, Response } from "express";
import { User } from "../models/User";
import { hashPassword, signToken, verifyPassword } from "../services/authService";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password || password.length < 6) {
    res.status(400).json({ error: "Email and password (min 6 chars) are required" });
    return;
  }

  const existing = await User.findOne({ email }).lean();
  if (existing) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ email, passwordHash });
  const token = signToken(user.id);

  res.status(201).json({ token, user: { id: user.id, email: user.email } });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, email: user.email } });
};
