import { Router } from "express";
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  archiveProperty,
  deleteProperty,
  duplicateProperty,
  smartImportProperties
} from "../controllers/propertyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getProperties);
router.post("/import", protect, smartImportProperties);
router.get("/:id", protect, getPropertyById);
router.post("/", protect, createProperty);
router.put("/:id", protect, updateProperty);
router.patch("/:id/archive", protect, archiveProperty);
router.delete("/:id", protect, deleteProperty);
router.post("/:id/duplicate", protect, duplicateProperty);

export default router;
