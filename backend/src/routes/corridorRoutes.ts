import { Router } from "express";
import {
  getCorridors,
  getCorridorById,
  createCorridor,
  updateCorridor,
  archiveCorridor,
  deleteCorridor
} from "../controllers/corridorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getCorridors);
router.get("/:id", protect, getCorridorById);
router.post("/", protect, createCorridor);
router.put("/:id", protect, updateCorridor);
router.patch("/:id/archive", protect, archiveCorridor);
router.delete("/:id", protect, deleteCorridor);

export default router;
