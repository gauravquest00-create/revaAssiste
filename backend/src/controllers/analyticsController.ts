import { Request, Response } from "express";
import { Lead } from "../models/Lead.js";
import { Project } from "../models/Project.js";
import { Property } from "../models/Property.js";
import { Visit } from "../models/Visit.js";
import { FollowUp } from "../models/FollowUp.js";
import { Deal } from "../models/Deal.js";
import { Task } from "../models/Task.js";

export const getAnalyticsOverview = async (req: Request, res: Response): Promise<void> => {
  try {
    const [leads, projects, properties, visits, followUps, deals, tasks] = await Promise.all([
      Lead.find(),
      Project.find(),
      Property.find(),
      Visit.find(),
      FollowUp.find(),
      Deal.find(),
      Task.find()
    ]);

    // 1. Lead Analytics
    const leadsByStage: Record<string, number> = {
      New: 0, Contacted: 0, Interested: 0, Exploring: 0,
      Advising: 0, Pitched: 0, Visiting: 0, Closing: 0, Won: 0, Lost: 0
    };
    const leadsByTemp = { Hot: 0, Warm: 0, Cold: 0 };
    const leadsByPurpose: Record<string, number> = {};
    const leadsBySource: Record<string, number> = {};

    leads.forEach(l => {
      if (leadsByStage[l.stage] !== undefined) leadsByStage[l.stage]++;
      if (leadsByTemp[l.temperature] !== undefined) leadsByTemp[l.temperature]++;
      leadsByPurpose[l.purpose] = (leadsByPurpose[l.purpose] || 0) + 1;
      leadsBySource[l.source] = (leadsBySource[l.source] || 0) + 1;
    });

    const wonLeads = leadsByStage.Won || 0;
    const totalLeads = leads.length;
    const conversionRate = totalLeads > 0 ? `${((wonLeads / totalLeads) * 100).toFixed(1)}%` : "0.0%";

    // 2. Sales Analytics
    const totalFollowUps = followUps.length;
    const completedFollowUps = followUps.filter(f => f.status === "Completed").length;
    const totalVisits = visits.length;
    const completedVisits = visits.filter(v => v.status === "Completed").length;
    const totalDeals = deals.length;
    const closedDeals = deals.filter(d => d.stage === "Closed");
    const totalClosedValue = closedDeals.reduce((acc, curr) => acc + (curr.dealValue || 0), 0);
    const activeNegotiations = deals.filter(d => d.stage === "Negotiation").length;

    // 3. Project Analytics
    const topProjects = projects.slice(0, 6).map(p => ({
      name: p.name,
      sector: p.sector,
      builder: p.builder,
      priceRange: p.priceRange?.formatted,
      availableUnits: properties.filter(prop => prop.projectName === p.name && prop.status === "Available").length,
      avgPricePerSqft: p.priceRange?.pricePerSqftAvg || 14000,
      livabilityScore: p.endUseIntelligence?.livabilityScore || 90
    }));

    // 4. Property Analytics
    const availableInventoryCount = properties.filter(p => p.status === "Available").length;
    const totalInventoryValue = properties.reduce((acc, curr) => acc + (curr.askingPrice || 0), 0);
    const propertiesByStatus = {
      Available: availableInventoryCount,
      UnderOffer: properties.filter(p => p.status === "Under Offer").length,
      Sold: properties.filter(p => p.status === "Sold").length
    };

    // 5. AI Analytics
    const aiTasksCompleted = tasks.filter(t => t.status === "Completed").length;
    const totalTasks = tasks.length;
    const aiPriorityDistribution = {
      hotPriority: leads.filter(l => (l.aiPriority?.score || 0) >= 90).length,
      highInterest: leads.filter(l => (l.aiPriority?.score || 0) >= 80 && (l.aiPriority?.score || 0) < 90).length,
      nurture: leads.filter(l => (l.aiPriority?.score || 0) < 80).length
    };

    res.json({
      success: true,
      analytics: {
        leadAnalytics: {
          totalLeads,
          conversionRate,
          leadsByStage,
          leadsByTemp,
          leadsByPurpose,
          leadsBySource
        },
        salesAnalytics: {
          totalFollowUps,
          completedFollowUps,
          totalVisits,
          completedVisits,
          activeNegotiations,
          totalDeals,
          totalClosedValue
        },
        projectAnalytics: {
          totalProjects: projects.length,
          topProjects
        },
        propertyAnalytics: {
          totalUnits: properties.length,
          availableInventoryCount,
          totalInventoryValue,
          propertiesByStatus
        },
        aiAnalytics: {
          totalTasks,
          aiTasksCompleted,
          aiPriorityDistribution
        }
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
