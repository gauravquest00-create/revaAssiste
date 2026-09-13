import { Router } from "express";
import { getAnalyticsOverview } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/overview", protect, getAnalyticsOverview);

export default router;
