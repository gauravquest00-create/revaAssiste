import mongoose, { Document, Schema } from "mongoose";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  source: "Direct Referral" | "Website" | "Walk-in" | "Channel Partner" | "Cold Call" | "Digital Ad";
  budget: {
    min: number;
    max: number;
    formatted: string;
  };
  purpose: "End Use" | "Investment" | "Rental Income" | "Capital Gain";
  corridor: string;
  preferredProjects: string[];
  interestedProjects: Array<{
    project?: mongoose.Types.ObjectId | string;
    projectName: string;
    addedAt?: Date;
    notes?: string;
  }>;
  alternativeProjects: Array<{
    project?: mongoose.Types.ObjectId | string;
    projectName: string;
    reason?: string;
    whatItDoesBetter?: string;
    whatItDoesWorse?: string;
    matchScore?: number;
    addedAt?: Date;
  }>;
  bhk: string[];
  areaMin?: number;
  timeline: "< 15 Days" | "< 30 Days" | "1 - 3 Months" | "3 - 6 Months" | "Exploring";
  familyStructure?: string;
  financing: "Pre-approved Loan" | "Self Funded / Cash" | "Loan Required" | "Subject to Property Sale";
  decisionMakers: string[];
  
  // Dedicated Client Requirement Section
  clientRequirement: {
    budgetRange: string;
    purpose: string;
    timeline: string;
    bhk: string[];
    areaSqft: string;
    facing: string;
    floorPreference: string;
    furnishing: string;
    lifestyle: string;
    preferredCorridor: string;
    preferredLocation: string;
    preferredSectors: string[];
    possessionPreference: string;
    investmentPriority: string;
    rentalPriority: string;
    familyRequirement: string;
    mustHave: string[];
    niceToHave: string[];
    financing: string;
    decisionMakers: string[];
    specialRequirements: string;
  };

  preferences: {
    preferredFloor?: string;
    facing?: string;
    mustHave: string[];
    niceToHave: string[];
  };
  objections: string[];
  temperature: "Hot" | "Warm" | "Cold";
  stage: "New" | "Contacted" | "Interested" | "Exploring" | "Advising" | "Pitched" | "Visiting" | "Closing" | "Won" | "Lost";
  activityState: "Follow-up" | "Scheduled" | "Visit" | "Awaiting Response" | "Negotiation";
  outcome: "Active" | "Hold" | "Not Interested" | "Lost" | "Won";
  lastInteraction?: Date;
  nextAction: {
    action: string;
    why: string;
    whatToSay: string;
    whatToAsk: string;
    whatNotToSay?: string;
    targetDate?: Date;
  };
  aiPriority: {
    score: number; // 0-100
    grade: "Hot Priority" | "High Interest" | "Warm Engagement" | "Cold / Nurture";
    explanation: string;
    topFactors: string[];
    lastCalculated: Date;
  };
  viewedProjects: Array<{ projectName: string; date: Date; feedback?: string }>;
  viewedProperties: Array<{ propertyId: string; date: Date; feedback?: string }>;
  notes: string;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: "" },
    source: {
      type: String,
      enum: ["Direct Referral", "Website", "Walk-in", "Channel Partner", "Cold Call", "Digital Ad"],
      default: "Direct Referral"
    },
    budget: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      formatted: { type: String, required: true }
    },
    purpose: {
      type: String,
      enum: ["End Use", "Investment", "Rental Income", "Capital Gain"],
      default: "End Use"
    },
    corridor: { type: String, default: "Dwarka Expressway" },
    preferredProjects: [{ type: String }],
    interestedProjects: [
      {
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        projectName: { type: String, required: true },
        addedAt: { type: Date, default: Date.now },
        notes: { type: String, default: "" }
      }
    ],
    alternativeProjects: [
      {
        project: { type: Schema.Types.ObjectId, ref: "Project" },
        projectName: { type: String, required: true },
        reason: { type: String, default: "Alternative option based on budget and configuration" },
        whatItDoesBetter: { type: String, default: "" },
        whatItDoesWorse: { type: String, default: "" },
        matchScore: { type: Number, default: 85 },
        addedAt: { type: Date, default: Date.now }
      }
    ],
    bhk: [{ type: String }],
    areaMin: { type: Number, default: 0 },
    timeline: {
      type: String,
      enum: ["< 15 Days", "< 30 Days", "1 - 3 Months", "3 - 6 Months", "Exploring"],
      default: "< 30 Days"
    },
    familyStructure: { type: String, default: "Couple with child" },
    financing: {
      type: String,
      enum: ["Pre-approved Loan", "Self Funded / Cash", "Loan Required", "Subject to Property Sale"],
      default: "Pre-approved Loan"
    },
    decisionMakers: [{ type: String }],

    clientRequirement: {
      budgetRange: { type: String, default: "₹2.0 Cr – ₹2.5 Cr" },
      purpose: { type: String, default: "End Use" },
      timeline: { type: String, default: "< 30 Days" },
      bhk: [{ type: String }],
      areaSqft: { type: String, default: "1500 - 1800 sqft" },
      facing: { type: String, default: "Park Facing / North-East" },
      floorPreference: { type: String, default: "Middle Floor (7th to 14th)" },
      furnishing: { type: String, default: "Semi-Furnished" },
      lifestyle: { type: String, default: "Premium Gated Community" },
      preferredCorridor: { type: String, default: "Dwarka Expressway" },
      preferredLocation: { type: String, default: "Sector 102 - 113" },
      preferredSectors: [{ type: String }],
      possessionPreference: { type: String, default: "Ready to Move or < 6 Months" },
      investmentPriority: { type: String, default: "Capital safety & High resale liquidity" },
      rentalPriority: { type: String, default: "Consistent 4%+ rental yield" },
      familyRequirement: { type: String, default: "Proximity to top schools & sports club" },
      mustHave: [{ type: String }],
      niceToHave: [{ type: String }],
      financing: { type: String, default: "Pre-approved Loan" },
      decisionMakers: [{ type: String }],
      specialRequirements: { type: String, default: "High construction quality with minimal noise" }
    },

    preferences: {
      preferredFloor: { type: String, default: "Middle to High" },
      facing: { type: String, default: "North-East / Park Facing" },
      mustHave: [{ type: String }],
      niceToHave: [{ type: String }]
    },
    objections: [{ type: String }],
    temperature: {
      type: String,
      enum: ["Hot", "Warm", "Cold"],
      default: "Hot"
    },
    stage: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Exploring", "Advising", "Pitched", "Visiting", "Closing", "Won", "Lost"],
      default: "Exploring"
    },
    activityState: {
      type: String,
      enum: ["Follow-up", "Scheduled", "Visit", "Awaiting Response", "Negotiation"],
      default: "Follow-up"
    },
    outcome: {
      type: String,
      enum: ["Active", "Hold", "Not Interested", "Lost", "Won"],
      default: "Active"
    },
    lastInteraction: { type: Date, default: Date.now },
    nextAction: {
      action: { type: String, default: "Initiate strategic follow-up" },
      why: { type: String, default: "Client matches inventory and buying timeline is under 30 days" },
      whatToSay: { type: String, default: "Discuss shortlisted inventory matching price points" },
      whatToAsk: { type: String, default: "Confirm site visit availability this weekend" },
      whatNotToSay: { type: String, default: "Do not offer discounts prematurely" },
      targetDate: { type: Date, default: () => new Date(Date.now() + 24 * 3600 * 1000) }
    },
    aiPriority: {
      score: { type: Number, default: 85 },
      grade: {
        type: String,
        enum: ["Hot Priority", "High Interest", "Warm Engagement", "Cold / Nurture"],
        default: "Hot Priority"
      },
      explanation: { type: String, default: "High budget alignment with active decision makers" },
      topFactors: [{ type: String }],
      lastCalculated: { type: Date, default: Date.now }
    },
    viewedProjects: [
      {
        projectName: { type: String },
        date: { type: Date, default: Date.now },
        feedback: { type: String }
      }
    ],
    viewedProperties: [
      {
        propertyId: { type: String },
        date: { type: Date, default: Date.now },
        feedback: { type: String }
      }
    ],
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

LeadSchema.index({ name: "text", phone: "text" });

export const Lead = mongoose.model<ILead>("Lead", LeadSchema);
