import { Router } from "express";
import {
  aiAnalyzeProject,
  aiGeneratePitch,
  aiMatch,
  aiLeadAnalyze,
  aiHandleObjection,
  aiNegotiation,
  aiConversationAnalyze,
  aiDailyPriority,
  aiSalesGuideChat,
  aiGetSalesGuideHistory,
  aiClearSalesGuideHistory
} from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/project/analyze", protect, aiAnalyzeProject);
router.post("/project/pitch", protect, aiGeneratePitch);
router.post("/match", protect, aiMatch);
router.post("/lead/analyze", protect, aiLeadAnalyze);
router.post("/objection", protect, aiHandleObjection);
router.post("/negotiation", protect, aiNegotiation);
router.post("/conversation/analyze", protect, aiConversationAnalyze);
router.post("/daily-priority", protect, aiDailyPriority);
router.post("/sales-guide/chat", protect, aiSalesGuideChat);
router.get("/sales-guide/history", protect, aiGetSalesGuideHistory);
router.delete("/sales-guide/history", protect, aiClearSalesGuideHistory);

export default router;
