import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { getProtectedData } from "../controllers/protected.controller";

const router = Router();

router.get("/data", authenticateToken, getProtectedData);

export default router;
