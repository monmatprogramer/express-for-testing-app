import { Router } from "express";
import {
  userHealth,
  userLogin,
  userProfile,
  userLogout,
} from "../controllers/user.controllers.js";
import { requireAdmin } from "../middlewares/authMiddlwares.js";

const router = Router();

router.get("/health", userHealth);
router.post("/login", userLogin);
router.get("/profile", requireAdmin, userProfile);
router.get("/logout", userLogout);
export default router;
