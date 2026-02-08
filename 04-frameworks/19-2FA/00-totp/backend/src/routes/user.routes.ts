import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getCurrentUser } from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticateToken, getCurrentUser);

export default router;
