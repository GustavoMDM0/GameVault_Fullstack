import express from "express";
import {
  registerUser,
  loginUser,
  getUserNotifications,
  checkUserGameDeals
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/notifications", protect, getUserNotifications);
router.post("/check-deals", protect, checkUserGameDeals);

export default router;
