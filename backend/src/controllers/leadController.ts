import { Request, Response } from "express";
import { Lead } from "../models/Lead.js";
import { Conversation } from "../models/Conversation.js";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { GeminiService } from "../services/ai/geminiService.js";

export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stage, temperature, activityState, outcome, search } = req.query;
    const filter: any = {};

    if (stage && stage !== "All") filter.stage = stage;
    if (temperature && temperature !== "All") filter.temperature = temperature;
    if (activityState && activityState !== "All") filter.activityState = activityState;
    if (outcome && outcome !== "All") filter.outcome = outcome;
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { phone: { $regex: search as string, $options: "i" } }
      ];
    }

    const leads = await Lead.find(filter).sort({ "aiPriority.score": -1 });
    res.json({ success: true, count: leads.length, leads });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    const conversations = await Conversation.find({ lead: lead._id }).sort({ timestamp: -1 });
    const tasks = await Task.find({ lead: lead._id }).sort({ dueDate: 1 });

    res.json({ success: true, lead, conversations, tasks });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const leadData = req.body;
    
    // Auto format budget if not provided
    if (leadData.budget && !leadData.budget.formatted && leadData.budget.min && leadData.budget.max) {
      leadData.budget.formatted = `₹${(leadData.budget.min / 10000000).toFixed(2)} Cr – ₹${(leadData.budget.max / 10000000).toFixed(2)} Cr`;
    }

    // Default clientRequirement if missing
    if (!leadData.clientRequirement) {
      leadData.clientRequirement = {
        budgetRange: leadData.budget?.formatted || "₹2.0 Cr – ₹2.5 Cr",
        purpose: leadData.purpose || "End Use",
        timeline: leadData.timeline || "< 30 Days",
        bhk: leadData.bhk || ["3 BHK"],
        areaSqft: leadData.areaMin ? `${leadData.areaMin} sqft+` : "1500 - 1800 sqft",
        facing: leadData.preferences?.facing || "Park Facing / North-East",
        floorPreference: leadData.preferences?.preferredFloor || "Middle Floor",
        furnishing: "Semi-Furnished",
        lifestyle: "Premium Gated Community",
        preferredCorridor: leadData.corridor || "Dwarka Expressway",
        preferredLocation: "Sector 102 - 113",
        preferredSectors: ["Sector 113", "Sector 104"],
        possessionPreference: "Ready to Move or < 6 Months",
        investmentPriority: "Capital safety & High resale liquidity",
        rentalPriority: "Consistent 4%+ rental yield",
        familyRequirement: leadData.familyStructure || "Couple with child",
        mustHave: leadData.preferences?.mustHave || [],
        niceToHave: leadData.preferences?.niceToHave || [],
        financing: leadData.financing || "Pre-approved Loan",
        decisionMakers: leadData.decisionMakers || ["Self"],
        specialRequirements: leadData.notes || ""
      };
    }

    const lead = await Lead.create(leadData);

    const availableProjects = await Project.find().limit(6);
    const aiDiag = await GeminiService.analyzeLead(lead, availableProjects);

    lead.aiPriority = {
      score: aiDiag.leadPriority || 88,
      grade: aiDiag.leadPriority >= 90 ? "Hot Priority" : "High Interest",
      explanation: aiDiag.reason || "Active lead with established budget",
      topFactors: [aiDiag.currentIntent, aiDiag.currentBlocker],
      lastCalculated: new Date()
    };
    lead.nextAction = {
      action: aiDiag.nextAction,
      why: aiDiag.reason,
      whatToSay: aiDiag.recommendedPitch,
      whatToAsk: aiDiag.questionsToAsk?.[0] || "Confirm site visit availability",
      whatNotToSay: "Do not negotiate price before in-person inspection",
      targetDate: new Date(Date.now() + 24 * 3600 * 1000)
    };
    await lead.save();

    res.status(201).json({ success: true, lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const updateData = req.body;
    
    // Ensure budget formatted string is in sync
    if (updateData.budget && updateData.budget.min && updateData.budget.max) {
      updateData.budget.formatted = `₹${(updateData.budget.min / 10000000).toFixed(2)} Cr – ₹${(updateData.budget.max / 10000000).toFixed(2)} Cr`;
    }

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    res.json({ success: true, message: "Lead updated successfully", lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const updateLeadStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stage, temperature, activityState, outcome } = req.body;
    const updateFields: any = {};
    if (stage) updateFields.stage = stage;
    if (temperature) updateFields.temperature = temperature;
    if (activityState) updateFields.activityState = activityState;
    if (outcome) updateFields.outcome = outcome;

    const lead = await Lead.findByIdAndUpdate(req.params.id, updateFields, { new: true });
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    res.json({ success: true, message: "Lead status updated", lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addInterestedProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, projectName, notes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    // Avoid duplicates
    if (!lead.interestedProjects.some(p => p.projectName === projectName)) {
      lead.interestedProjects.push({
        project: projectId,
        projectName,
        notes: notes || "",
        addedAt: new Date()
      });
      if (!lead.preferredProjects.includes(projectName)) {
        lead.preferredProjects.push(projectName);
      }
      await lead.save();
    }

    res.json({ success: true, message: "Project added to interested list", lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const removeInterestedProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectName } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    lead.interestedProjects = lead.interestedProjects.filter(p => p.projectName !== projectName);
    lead.preferredProjects = lead.preferredProjects.filter(p => p !== projectName);
    await lead.save();

    res.json({ success: true, message: "Project removed from interested list", lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const addAlternativeProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectName, reason, whatItDoesBetter, whatItDoesWorse, matchScore } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    lead.alternativeProjects.push({
      projectName,
      reason: reason || "Recommended as value alternative",
      whatItDoesBetter: whatItDoesBetter || "",
      whatItDoesWorse: whatItDoesWorse || "",
      matchScore: matchScore || 85,
      addedAt: new Date()
    });
    await lead.save();

    res.json({ success: true, message: "Alternative project added", lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const removeAlternativeProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectName } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    lead.alternativeProjects = lead.alternativeProjects.filter(p => p.projectName !== projectName);
    await lead.save();

    res.json({ success: true, message: "Alternative project removed", lead });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const suggestAlternatives = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    const allProjects = await Project.find();
    const primaryName = lead.preferredProjects?.[0] || "Tata La Vida";
    
    // Pick alternatives that are not already in preferred
    const alts = allProjects
      .filter(p => p.name !== primaryName && !lead.preferredProjects.includes(p.name))
      .slice(0, 3)
      .map(p => ({
        projectName: p.name,
        reason: `Shares comparable sector positioning in ${p.sector} with matching ${lead.bhk?.join("/") || "3 BHK"} configurations.`,
        whatItDoesBetter: p.usp?.[0] || "Competitive price per square foot.",
        whatItDoesWorse: p.weaknesses?.[0] || "Different possession milestone.",
        matchScore: Math.floor(Math.random() * 8) + 84
      }));

    res.json({ success: true, alternatives: alts });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const analyzeConversationPreview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawNotes } = req.body;
    const aiResult = await GeminiService.analyzeConversation(rawNotes);
    res.json({ success: true, detectedChanges: aiResult });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead removed" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const recordConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rawNotes } = req.body;
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }

    const aiResult = await GeminiService.analyzeConversation(rawNotes);

    const conv = await Conversation.create({
      lead: lead._id,
      leadName: lead.name,
      rawInput: rawNotes,
      extractedData: aiResult.extractedData,
      recommendedNextAction: aiResult.recommendedNextAction,
      salesTip: aiResult.salesTip,
      timestamp: new Date()
    });

    if (aiResult.extractedData.temperature) {
      lead.temperature = aiResult.extractedData.temperature as any;
    }
    if (aiResult.extractedData.objection && aiResult.extractedData.objection !== "None detected") {
      if (!lead.objections.includes(aiResult.extractedData.objection)) {
        lead.objections.push(aiResult.extractedData.objection);
      }
    }
    lead.lastInteraction = new Date();
    lead.nextAction = {
      action: aiResult.recommendedNextAction,
      why: `Extracted from conversation note regarding ${aiResult.extractedData.objection || 'positive buyer interest'}`,
      whatToSay: aiResult.salesTip,
      whatToAsk: "When are you and your family free for a physical walkthrough?",
      whatNotToSay: "Do not bring up objections unprompted",
      targetDate: new Date(Date.now() + 24 * 3600 * 1000)
    };
    await lead.save();

    await Task.create({
      lead: lead._id,
      leadName: lead.name,
      title: `Follow up with ${lead.name}: ${aiResult.recommendedNextAction.slice(0, 45)}...`,
      type: "Follow-up",
      why: `Client expressed: "${rawNotes.slice(0, 80)}..."`,
      whatToDo: aiResult.recommendedNextAction,
      whatToSay: aiResult.salesTip,
      whatToAsk: "Lock down specific time for site walkthrough",
      whatNotToSay: "Avoid discounting before unit selection",
      expectedOutcome: "Scheduled visit or locked inventory preference",
      recommendedNextStep: "Prepare project comparative sheet",
      status: "Pending",
      priority: "High",
      dueDate: new Date(Date.now() + 24 * 3600 * 1000)
    });

    res.json({
      success: true,
      conversation: conv,
      lead
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
