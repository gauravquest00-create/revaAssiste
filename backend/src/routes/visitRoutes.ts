import { Router } from "express";
import {
  getVisits,
  getVisitById,
  createVisit,
  updateVisit,
  rescheduleVisit,
  updateVisitStatus,
  deleteVisit,
  analyzeVisit
} from "../controllers/visitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getVisits);
router.get("/:id", protect, getVisitById);
router.post("/", protect, createVisit);
router.put("/:id", protect, updateVisit);
router.patch("/:id/reschedule", protect, rescheduleVisit);
router.patch("/:id/status", protect, updateVisitStatus);
router.delete("/:id", protect, deleteVisit);
router.post("/:id/analyze", protect, analyzeVisit);

export default router;
