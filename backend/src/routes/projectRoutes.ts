import { Router } from "express";
import {
  getProjects,
  getProjectById,
  getProjectIntelligence,
  getQuickPitch,
  createProject,
  updateProject,
  archiveProject,
  deleteProject
} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.get("/:id/intelligence", protect, getProjectIntelligence);
router.get("/:id/quick-pitch", protect, getQuickPitch);
router.post("/", protect, createProject);
router.put("/:id", protect, updateProject);
router.patch("/:id/archive", protect, archiveProject);
router.delete("/:id", protect, deleteProject);

export default router;
