import { Request, Response } from "express";
import mongoose, { Schema } from "mongoose";
import { GeminiService } from "../services/ai/geminiService.js";
import { Project } from "../models/Project.js";
import { Property } from "../models/Property.js";
import { Lead } from "../models/Lead.js";
import { Task } from "../models/Task.js";

// Self-contained SalesGuideMessage model
const SalesGuideMessage = mongoose.models.SalesGuideMessage || mongoose.model(
  "SalesGuideMessage",
  new Schema(
    {
      sender: { type: String, enum: ["user", "ai"], required: true },
      text: { type: String, required: true },
      projects: { type: [Schema.Types.Mixed], default: [] },
      timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
  )
);

export const aiAnalyzeProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, buyerRequirement } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const result = await GeminiService.analyzeProject(project, buyerRequirement);
    res.json({ success: true, analysis: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiGeneratePitch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, leadId, persona } = req.body;
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    const lead = leadId ? await Lead.findById(leadId) : null;
    const pitch = await GeminiService.generateSalesPitch(project, lead, persona);
    res.json({ success: true, pitch });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiMatch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requirement } = req.body;
    const [projects, properties] = await Promise.all([
      Project.find({ isArchived: { $ne: true } }),
      Property.find({ status: "Available" })
    ]);

    const matches = await GeminiService.matchProjects(requirement, projects, properties);
    res.json({ success: true, matches });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiLeadAnalyze = async (req: Request, res: Response): Promise<void> => {
  try {
    const { leadId } = req.body;
    const lead = await Lead.findById(leadId);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    const projects = await Project.find().limit(8);
    const diagnosis = await GeminiService.analyzeLead(lead, projects);
    res.json({ success: true, diagnosis });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiHandleObjection = async (req: Request, res: Response): Promise<void> => {
  try {
    const { objection, projectId, leadId } = req.body;
    const project = await Project.findById(projectId) || { name: "Tata La Vida", sector: "Sector 113", priceRange: { formatted: "₹2.2 Cr - ₹2.5 Cr" } };
    const lead = leadId ? await Lead.findById(leadId) : null;

    const result = await GeminiService.handleObjection(objection, project, lead);
    res.json({ success: true, objectionAdvice: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiNegotiation = async (req: Request, res: Response): Promise<void> => {
  try {
    const advice = await GeminiService.adviseNegotiation(req.body);
    res.json({ success: true, advice });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiConversationAnalyze = async (req: Request, res: Response): Promise<void> => {
  try {
    const { notes } = req.body;
    const result = await GeminiService.analyzeConversation(notes);
    res.json({ success: true, analysis: result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiDailyPriority = async (req: Request, res: Response): Promise<void> => {
  try {
    const [leads, tasks] = await Promise.all([
      Lead.find({ outcome: "Active" }).limit(10),
      Task.find({ status: "Pending" }).limit(10)
    ]);
    const briefing = await GeminiService.generateDailyPriorities(leads, tasks);
    res.json({ success: true, briefing });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiSalesGuideChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, history } = req.body;
    if (!message || !message.trim()) {
      res.status(400).json({ success: false, message: "Message is required" });
      return;
    }

    await SalesGuideMessage.create({
      sender: "user",
      text: message,
      timestamp: new Date()
    });

    const result = await GeminiService.salesGuideChat(message, history || []);

    const aiMsg = await SalesGuideMessage.create({
      sender: "ai",
      text: result.text,
      projects: result.projects || [],
      timestamp: new Date()
    });

    res.json({
      success: true,
      reply: result.text,
      projects: result.projects || [],
      messageId: aiMsg._id
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiGetSalesGuideHistory = async (_req: Request, res: Response): Promise<void> => {
  try {
    const messages = await SalesGuideMessage.find().sort({ timestamp: 1 }).limit(100);
    res.json({ success: true, messages });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const aiClearSalesGuideHistory = async (_req: Request, res: Response): Promise<void> => {
  try {
    await SalesGuideMessage.deleteMany({});
    res.json({ success: true, message: "Sales guide conversation cleared" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};