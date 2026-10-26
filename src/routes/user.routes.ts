import { Router } from "express";
import {
  userHealth,
  userLogin,
  userProfile,
} from "../controllers/user.controllers";

const router = Router();

router.get("/health", userHealth);
router.post("/login", userLogin);
router.get("/profile", userProfile);
export default router;
