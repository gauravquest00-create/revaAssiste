import { Request, Response } from "express";
import { Visit } from "../models/Visit.js";
import { Lead } from "../models/Lead.js";

export const getVisits = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, lead, project } = req.query;
    const filter: any = {};
    if (status && status !== "All") filter.status = status;
    if (lead) filter.lead = lead;
    if (project) filter.project = project;

    const visits = await Visit.find(filter).sort({ date: -1 });
    res.json({ success: true, count: visits.length, visits });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getVisitById = async (req: Request, res: Response): Promise<void> => {
  try {
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      res.status(404).json({ success: false, message: "Visit not found" });
      return;
    }
    res.json({ success: true, visit });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    // All relationships: lead, property, project are optional
    const visit = await Visit.create(req.body);
    res.status(201).json({ success: true, visit });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!visit) {
      res.status(404).json({ success: false, message: "Visit not found" });
      return;
    }
    res.json({ success: true, message: "Visit updated successfully", visit });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rescheduleVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time, reason } = req.body;
    const visit = await Visit.findByIdAndUpdate(
      req.params.id,
      {
        date: new Date(date),
        time: time || "11:00 AM",
        status: "Rescheduled",
        notes: reason ? `Rescheduled reason: ${reason}` : undefined
      },
      { new: true }
    );
    if (!visit) {
      res.status(404).json({ success: false, message: "Visit not found" });
      return;
    }
    res.json({ success: true, message: "Visit rescheduled successfully", visit });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateVisitStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, outcome, clientFeedback, objections } = req.body;
    const updateFields: any = { status };
    if (outcome) updateFields.outcome = outcome;
    if (clientFeedback) updateFields.clientFeedback = clientFeedback;
    if (objections) updateFields.objections = objections;

    const visit = await Visit.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!visit) {
      res.status(404).json({ success: false, message: "Visit not found" });
      return;
    }
    res.json({ success: true, message: "Visit status updated", visit });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    await Visit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Visit removed" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const analyzeVisit = async (req: Request, res: Response): Promise<void> => {
  try {
    const { feedback, outcome } = req.body;
    const visit = await Visit.findById(req.params.id);
    if (!visit) {
      res.status(404).json({ success: false, message: "Visit not found" });
      return;
    }

    visit.clientFeedback = feedback || visit.clientFeedback;
    visit.outcome = outcome || visit.outcome;
    visit.status = "Completed";

    visit.aiAnalysis = {
      interestLevel: "Very High",
      primaryObjection: feedback.includes("price") ? "Asking price negotiation" : "Comparison with adjacent tower",
      preferredPropertyDetails: visit.propertyUnit || "3 BHK Upper Floor",
      decisionMakerReaction: "Family positively inclined toward open layout",
      probabilityChange: "+20% closing likelihood",
      recommendedNextStep: "Prepare formal offer sheet with seller token terms within 24 hours"
    };

    await visit.save();

    if (visit.lead) {
      await Lead.findByIdAndUpdate(visit.lead, {
        stage: "Closing",
        activityState: "Negotiation",
        temperature: "Hot",
        "nextAction.action": "Submit opening buyer offer to seller"
      });
    }

    res.json({ success: true, visit });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
