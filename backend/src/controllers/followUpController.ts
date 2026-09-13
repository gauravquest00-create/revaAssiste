import { Request, Response } from "express";
import { FollowUp } from "../models/FollowUp.js";

export const getFollowUps = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, channel, lead } = req.query;
    const filter: any = {};
    if (status && status !== "All") filter.status = status;
    if (channel && channel !== "All") filter.channel = channel;
    if (lead) filter.lead = lead;

    const followUps = await FollowUp.find(filter).sort({ date: 1 });
    res.json({ success: true, count: followUps.length, followUps });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFollowUpById = async (req: Request, res: Response): Promise<void> => {
  try {
    const followUp = await FollowUp.findById(req.params.id);
    if (!followUp) {
      res.status(404).json({ success: false, message: "Follow-up not found" });
      return;
    }
    res.json({ success: true, followUp });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    // Relationships are all completely optional: lead, property, project
    const followUp = await FollowUp.create(req.body);
    res.status(201).json({ success: true, followUp });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!followUp) {
      res.status(404).json({ success: false, message: "Follow-up not found" });
      return;
    }
    res.json({ success: true, message: "Follow-up updated successfully", followUp });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rescheduleFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, time, reason } = req.body;
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      {
        date: new Date(date),
        time: time || "11:00 AM",
        status: "Rescheduled",
        notes: reason ? `Rescheduled reason: ${reason}` : undefined
      },
      { new: true }
    );
    if (!followUp) {
      res.status(404).json({ success: false, message: "Follow-up not found" });
      return;
    }
    res.json({ success: true, message: "Follow-up rescheduled successfully", followUp });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateFollowUpStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, outcome } = req.body;
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { status, outcome: outcome || undefined },
      { new: true }
    );
    if (!followUp) {
      res.status(404).json({ success: false, message: "Follow-up not found" });
      return;
    }
    res.json({ success: true, message: "Follow-up status updated", followUp });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteFollowUp = async (req: Request, res: Response): Promise<void> => {
  try {
    await FollowUp.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Follow-up removed" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
