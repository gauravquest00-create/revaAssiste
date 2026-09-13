import { Request, Response } from "express";
import { Deal } from "../models/Deal.js";
import { GeminiService } from "../services/ai/geminiService.js";

export const getDeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const deals = await Deal.find().sort({ createdAt: -1 });
    res.json({ success: true, count: deals.length, deals });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getDealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      res.status(404).json({ success: false, message: "Deal not found" });
      return;
    }
    res.json({ success: true, deal });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const dealCode = `DEAL-DWX-${Date.now().toString().slice(-6)}`;
    const advice = await GeminiService.adviseNegotiation(req.body);

    const deal = await Deal.create({
      ...req.body,
      dealCode,
      aiNegotiationAdvice: advice
    });

    res.status(201).json({ success: true, deal });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addCounterOffer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { offeredBy, amount, notes } = req.body;
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      res.status(404).json({ success: false, message: "Deal not found" });
      return;
    }

    deal.counterOffers.push({
      offeredBy,
      amount,
      notes,
      date: new Date()
    });

    const updatedAdvice = await GeminiService.adviseNegotiation({
      projectName: deal.projectName,
      propertyUnit: deal.propertyUnit,
      buyerOffer: offeredBy === "Buyer" ? amount : deal.buyerOffer,
      sellerAsk: offeredBy === "Seller" ? amount : deal.sellerAsk,
      counterOffers: deal.counterOffers
    });

    deal.aiNegotiationAdvice = updatedAdvice;
    await deal.save();

    res.json({ success: true, deal });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, deal });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
