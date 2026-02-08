import { Router } from "express";
import { authenticateToken } from "../middleware/auth";
import { setup2FA, verify2FA, enable2FA } from "../controllers/twoFactor.controller";

const router = Router();

router.post("/setup", authenticateToken, setup2FA);
router.post("/verify", verify2FA);
router.post("/enable", authenticateToken, enable2FA);

export default router;
