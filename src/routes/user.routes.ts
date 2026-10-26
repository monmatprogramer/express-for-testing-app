import { Router } from "express";
import {
  userHealth,
  userLogin,
  userProfile,
} from "../controllers/user.controllers";
import { requireAdmin } from "../middlewares/authMiddlwares";

const router = Router();

router.get("/health", userHealth);
router.post("/login", userLogin);
router.get("/profile", requireAdmin, userProfile);
export default router;
