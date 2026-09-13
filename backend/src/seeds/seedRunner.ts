import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Corridor } from "../models/Corridor.js";
import { Project } from "../models/Project.js";
import { Property } from "../models/Property.js";
import { Lead } from "../models/Lead.js";
import { Task } from "../models/Task.js";
import { Visit } from "../models/Visit.js";
import { FollowUp } from "../models/FollowUp.js";
import { Deal } from "../models/Deal.js";
import {
  defaultUser,
  defaultCorridor,
  verified15Projects,
  sampleVerifiedProperties,
  sampleLeads,
  sampleTasks
} from "./seedData.js";

const runSeed = async () => {
  try {
    console.log("[Seed] Connecting to MongoDB...");
    await connectDB();

    console.log("[Seed] Clearing existing collections...");
    await Promise.all([
      User.deleteMany({}),
      Corridor.deleteMany({}),
      Project.deleteMany({}),
      Property.deleteMany({}),
      Lead.deleteMany({}),
      Task.deleteMany({}),
      Visit.deleteMany({}),
      FollowUp.deleteMany({}),
      Deal.deleteMany({})
    ]);

    // 1. Seed User
    console.log("[Seed] Seeding default consultant user (gauravquest00@gmail.com)...");
    const user = await User.create(defaultUser);
    console.log(`[Seed] User created: ${user.email} (Password hashed securely)`);

    // 2. Seed Corridor
    console.log("[Seed] Seeding Dwarka Expressway corridor...");
    const corridor = await Corridor.create(defaultCorridor);
    console.log(`[Seed] Corridor seeded: ${corridor.name}`);

    // 3. Seed 15 Verified Projects
    console.log("[Seed] Seeding 15 verified Dwarka Expressway projects...");
    const projectDocs = [];
    for (const proj of verified15Projects) {
      const pDoc = await Project.create({
        ...proj,
        corridor: corridor._id,
        corridorName: corridor.name
      });
      projectDocs.push(pDoc);
    }
    console.log(`[Seed] Successfully seeded ${projectDocs.length} verified projects.`);

    // 4. Seed Verified Properties
    console.log("[Seed] Seeding verified sample properties...");
    const propDocs = [];
    for (const prop of sampleVerifiedProperties) {
      const projectMatch = projectDocs.find(p => p.name === prop.projectName) || projectDocs[0];
      const pDoc = await Property.create({
        ...prop,
        project: projectMatch._id,
        corridor: corridor._id,
        corridorName: corridor.name
      });
      propDocs.push(pDoc);
    }
    console.log(`[Seed] Seeded ${propDocs.length} verified property units.`);

    // 5. Seed Leads
    console.log("[Seed] Seeding active leads...");
    const leadDocs = [];
    for (const lead of sampleLeads) {
      const lDoc = await Lead.create(lead);
      leadDocs.push(lDoc);
    }
    console.log(`[Seed] Seeded ${leadDocs.length} active leads.`);

    // 6. Seed Tasks
    console.log("[Seed] Seeding daily sales tasks...");
    for (let i = 0; i < sampleTasks.length; i++) {
      const t = sampleTasks[i];
      const matchingLead = leadDocs.find(l => l.name === t.leadName) || leadDocs[0];
      await Task.create({
        ...t,
        lead: matchingLead._id
      });
    }
    console.log(`[Seed] Seeded ${sampleTasks.length} daily priority tasks.`);

    // 7. Seed Sample Visit
    console.log("[Seed] Seeding sample upcoming visit...");
    await Visit.create({
      lead: leadDocs[0]._id,
      leadName: leadDocs[0].name,
      project: projectDocs[1]._id, // Tata La Vida
      projectName: projectDocs[1].name,
      property: propDocs[0]._id,
      propertyUnit: propDocs[0].unit,
      date: new Date(Date.now() + 2 * 24 * 3600 * 1000),
      time: "11:30 AM",
      location: "Tata La Vida, Sector 113, Dwarka Expressway",
      attendees: ["Rahul Sharma", "Pooja Sharma (Wife)", "Gaurav Verma (Advisor)"],
      status: "Scheduled",
      nextAction: "Perform final walkthrough and confirm token paperwork"
    });

    // 8. Seed Sample Follow-Up
    console.log("[Seed] Seeding sample follow-up...");
    await FollowUp.create({
      lead: leadDocs[1]._id,
      leadName: leadDocs[1].name,
      date: new Date(),
      time: "3:00 PM",
      channel: "WhatsApp",
      reason: "Deliver comparative ROI yield metrics for Sector 113",
      message: "Shared PDF investment matrix comparing M3M Capital and SmartWorld One DXP.",
      outcome: "Awaiting confirmation for Friday review call",
      status: "Pending"
    });

    // 9. Seed Active Deal
    console.log("[Seed] Seeding active deal in negotiation...");
    await Deal.create({
      dealCode: "DEAL-DWX-101402",
      lead: leadDocs[0]._id,
      leadName: leadDocs[0].name,
      project: projectDocs[1]._id,
      projectName: projectDocs[1].name,
      property: propDocs[0]._id,
      propertyUnit: propDocs[0].unit,
      buyerName: leadDocs[0].name,
      sellerName: propDocs[0].seller.name,
      buyerOffer: 22000000,
      sellerAsk: 22800000,
      counterOffers: [
        {
          offeredBy: "Buyer",
          amount: 21500000,
          date: new Date(Date.now() - 48 * 3600 * 1000),
          notes: "Initial oral offer"
        },
        {
          offeredBy: "Seller",
          amount: 22800000,
          date: new Date(Date.now() - 24 * 3600 * 1000),
          notes: "Counter asking for registry cost sharing"
        },
        {
          offeredBy: "Consultant Suggestion",
          amount: 22000000,
          date: new Date(),
          notes: "Target closing settlement price"
        }
      ],
      tokenAmount: 500000,
      agreementStatus: "Pending",
      documentationStatus: "KYC Verified",
      paymentStatus: "Token Paid",
      dealValue: 22000000,
      brokeragePercentage: 1.0,
      brokerageAmount: 220000,
      stage: "Negotiation",
      aiNegotiationAdvice: {
        openingStrategy: "Lock ₹2.20 Cr settlement by presenting immediate non-refundable token cheque.",
        targetSettlementPrice: 22000000,
        walkAwayConsideration: "Do not exceed ₹2.22 Cr; alternative unit in Hero Homes available at ₹2.16 Cr.",
        recommendedTalkingPoints: [
          "Buyer's loan is sanctioned with immediate drawdown capability.",
          "Seller avoids ongoing winter holding costs.",
          "Immediate registry within 30 days."
        ],
        riskFactor: "Seller ego regarding initial ₹2.28 Cr demand."
      }
    });

    console.log("===================================================================");
    console.log(" REVA ASSISTE Database Seed Completed Successfully!");
    console.log(" 1 Admin User: gauravquest00@gmail.com (Password: Admin123@)");
    console.log(" 1 Corridor: Dwarka Expressway");
    console.log(" 15 Verified Projects: Sector 102 to 113 Established Shortlist");
    console.log(" 5 Verified Property Units");
    console.log(" 3 Realistic Leads with AI Priority & Context");
    console.log(" Daily Priority Tasks, Visits, Follow-Ups & Deals Seeded");
    console.log("===================================================================");

    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error executing seed runner:", error);
    process.exit(1);
  }
};

runSeed();
