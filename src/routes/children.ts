import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createChild, getChild, listChildren } from "../controllers/childController";
import { validateBody } from "../middleware/validateBody";
import { childCreateSchema } from "../validation/schemas";

const router = Router();

router.use(requireAuth);

router.get("/children", listChildren);
router.get("/children/:id", getChild);
router.post("/children", validateBody(childCreateSchema), createChild);

export default router;
