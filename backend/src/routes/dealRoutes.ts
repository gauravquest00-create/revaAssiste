import { Router } from "express";
import {
  getDeals,
  getDealById,
  createDeal,
  addCounterOffer,
  updateDeal
} from "../controllers/dealController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protect, getDeals);
router.get("/:id", protect, getDealById);
router.post("/", protect, createDeal);
router.put("/:id", protect, updateDeal);
router.post("/:id/counter-offer", protect, addCounterOffer);

export default router;
