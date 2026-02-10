import { Router } from "express";
import { login, register } from "../controllers/authController";
import { validateBody } from "../middleware/validateBody";
import { loginSchema, registerSchema } from "../validation/schemas";

const router = Router();

router.post("/auth/register", validateBody(registerSchema), register);
router.post("/auth/login", validateBody(loginSchema), login);

export default router;
