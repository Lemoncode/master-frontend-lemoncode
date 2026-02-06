import { Router } from "express";
import { setup2FA, verify2FA, enable2FA } from "../controllers/twoFactor.controller";

const router = Router();

router.post("/setup", setup2FA);
router.post("/verify", verify2FA);
router.post("/enable", enable2FA);

export default router;
