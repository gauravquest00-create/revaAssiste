import { Router } from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  addInterestedProject,
  removeInterestedProject,
  addAlternativeProject,
  removeAlternativeProject,
  suggestAlternatives,
  analyzeConversationPreview,
  deleteLead,
  recordConversation
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getLeads);
router.get("/:id", protect, getLeadById);
router.post("/", protect, createLead);
router.put("/:id", protect, updateLead);
router.patch("/:id/status", protect, updateLeadStatus);
router.post("/:id/interested-projects", protect, addInterestedProject);
router.delete("/:id/interested-projects", protect, removeInterestedProject);
router.post("/:id/alternative-projects", protect, addAlternativeProject);
router.delete("/:id/alternative-projects", protect, removeAlternativeProject);
router.get("/:id/suggest-alternatives", protect, suggestAlternatives);
router.post("/:id/analyze-conversation-preview", protect, analyzeConversationPreview);
router.delete("/:id", protect, deleteLead);
router.post("/:id/conversation", protect, recordConversation);

export default router;
