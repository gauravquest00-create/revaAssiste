import { Router } from "express";
import {
  getFollowUps,
  getFollowUpById,
  createFollowUp,
  updateFollowUp,
  rescheduleFollowUp,
  updateFollowUpStatus,
  deleteFollowUp
} from "../controllers/followUpController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getFollowUps);
router.get("/:id", protect, getFollowUpById);
router.post("/", protect, createFollowUp);
router.put("/:id", protect, updateFollowUp);
router.patch("/:id/reschedule", protect, rescheduleFollowUp);
router.patch("/:id/status", protect, updateFollowUpStatus);
router.delete("/:id", protect, deleteFollowUp);

export default router;
