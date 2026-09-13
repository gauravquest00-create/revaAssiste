import { Router } from "express";
import { getDashboardStats, getCommandCenter } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/stats", protect, getDashboardStats);
router.get("/command-center", protect, getCommandCenter);

export default router;
