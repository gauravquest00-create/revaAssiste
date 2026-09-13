import { Request, Response } from "express";
import { Lead } from "../models/Lead.js";
import { Property } from "../models/Property.js";
import { Project } from "../models/Project.js";
import { Visit } from "../models/Visit.js";
import { FollowUp } from "../models/FollowUp.js";
import { Task } from "../models/Task.js";
import { Deal } from "../models/Deal.js";
import { GeminiService } from "../services/ai/geminiService.js";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalLeads,
      hotLeads,
      availableProperties,
      totalProjects,
      todayVisits,
      todayFollowUps,
      activeDeals
    ] = await Promise.all([
      Lead.countDocuments({ outcome: "Active" }),
      Lead.countDocuments({ temperature: "Hot", outcome: "Active" }),
      Property.countDocuments({ status: "Available" }),
      Project.countDocuments(),
      Visit.countDocuments({ status: { $in: ["Scheduled", "Confirmed"] } }),
      FollowUp.countDocuments({ status: "Pending" }),
      Deal.countDocuments({ stage: { $ne: "Closed" } })
    ]);

    res.json({
      success: true,
      stats: {
        totalLeads,
        hotLeads,
        availableProperties,
        totalProjects,
        todayVisits,
        todayFollowUps,
        activeDeals
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getCommandCenter = async (req: Request, res: Response): Promise<void> => {
  try {
    const [leads, tasks, visits, deals] = await Promise.all([
      Lead.find({ outcome: "Active" }).sort({ "aiPriority.score": -1 }).limit(6),
      Task.find({ status: "Pending" }).sort({ priority: 1, dueDate: 1 }).limit(6),
      Visit.find({ status: { $in: ["Scheduled", "Confirmed"] } }).sort({ date: 1 }).limit(4),
      Deal.find({ stage: "Negotiation" }).limit(4)
    ]);

    const commandCenterAi = await GeminiService.generateDailyPriorities(leads, tasks);

    res.json({
      success: true,
      commandCenter: {
        aiBriefing: commandCenterAi,
        highPriorityLeads: leads,
        todayTasks: tasks,
        upcomingVisits: visits,
        activeNegotiations: deals
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
