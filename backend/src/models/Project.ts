import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  slug: string;
  builder: string;
  builderIntelligence: {
    deliveryTrackRecord: string;
    constructionQuality: "Premium" | "Luxury" | "Standard" | "Ultra Luxury";
    knownIssues: string[];
    financialHealth: string;
  };
  corridor: mongoose.Types.ObjectId | string;
  corridorName: string;
  sector: string;
  address: string;
  projectArea: string;
  towers: number | string;
  floors: number | string;
  units: number | string;
  configurations: string[];
  launchDate: string;
  possession: string;
  status: "Ready to Move" | "Under Construction" | "Near Possession" | "New Launch";
  priceRange: {
    min: number;
    max: number;
    formatted: string;
    pricePerSqftAvg: number;
  };
  amenities: string[];
  connectivity: string[];
  usp: string[];
  weaknesses: string[];
  marketPosition: "Luxury" | "Premium End-Use" | "Mid-Market" | "Ultra Luxury" | "High Yield";
  rentalIntelligence: {
    expectedYield: string;
    monthlyRental2BHK?: string;
    monthlyRental3BHK?: string;
    monthlyRental4BHK?: string;
    tenantProfile: string;
  };
  investmentIntelligence: {
    threeYearAppreciation: string;
    exitLiquidity: "High" | "Moderate" | "Low";
    investmentThesis: string;
  };
  endUseIntelligence: {
    livabilityScore: number;
    familyFriendlyScore: number;
    noiseAndPollutionRating: string;
    communityVibe: string;
  };
  maintenance: {
    estimatedMonthlyPerSqft: number | string;
    agencyName: string;
  };
  resaleIntelligence: {
    demandGrade: "A+" | "A" | "B+" | "B";
    averageDaysOnMarket: number | string;
  };
  photos: string[];
  documents: Array<{ title: string; url: string; type: string }>;
  reraNumber: string;
  notes: string;
  isArchived?: boolean;
  verificationStatus: "Verified" | "Needs Verification" | "Not Verified";
  lastVerified: Date;
  source: string;
  dataVersion: number;
  aiIntelligence: {
    summary: string;
    targetBuyerProfile: string;
    salesPlaybook: string;
    recommendedSellingAngle: string;
    frequentlyAskedQuestions: Array<{ question: string; answer: string }>;
    alternativeProjects: Array<{
      projectName: string;
      reason: string;
      whatItDoesBetter: string;
      whatItDoesWorse: string;
      idealFor: string;
    }>;
    generatedAt: Date;
    model: string;
  };
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    builder: { type: String, required: true, trim: true },
    builderIntelligence: {
      deliveryTrackRecord: { type: String, default: "Verified track record" },
      constructionQuality: { type: String, enum: ["Premium", "Luxury", "Standard", "Ultra Luxury"], default: "Premium" },
      knownIssues: [{ type: String }],
      financialHealth: { type: String, default: "Stable" }
    },
    corridor: { type: Schema.Types.ObjectId, ref: "Corridor" },
    corridorName: { type: String, default: "Dwarka Expressway" },
    sector: { type: String, required: true },
    address: { type: String, required: true },
    projectArea: { type: String, default: "Not verified" },
    towers: { type: Schema.Types.Mixed, default: "Not verified" },
    floors: { type: Schema.Types.Mixed, default: "Not verified" },
    units: { type: Schema.Types.Mixed, default: "Not verified" },
    configurations: [{ type: String }],
    launchDate: { type: String, default: "Not verified" },
    possession: { type: String, default: "Not verified" },
    status: {
      type: String,
      enum: ["Ready to Move", "Under Construction", "Near Possession", "New Launch"],
      default: "Ready to Move"
    },
    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
      formatted: { type: String, required: true },
      pricePerSqftAvg: { type: Number, default: 0 }
    },
    amenities: [{ type: String }],
    connectivity: [{ type: String }],
    usp: [{ type: String }],
    weaknesses: [{ type: String }],
    marketPosition: {
      type: String,
      enum: ["Luxury", "Premium End-Use", "Mid-Market", "Ultra Luxury", "High Yield"],
      default: "Premium End-Use"
    },
    rentalIntelligence: {
      expectedYield: { type: String, default: "3.5% – 4.2%" },
      monthlyRental2BHK: { type: String, default: "Not verified" },
      monthlyRental3BHK: { type: String, default: "Not verified" },
      monthlyRental4BHK: { type: String, default: "Not verified" },
      tenantProfile: { type: String, default: "Corporate Executives & Families" }
    },
    investmentIntelligence: {
      threeYearAppreciation: { type: String, default: "14% – 18% CAGR" },
      exitLiquidity: { type: String, enum: ["High", "Moderate", "Low"], default: "High" },
      investmentThesis: { type: String, default: "High appreciation corridor" }
    },
    endUseIntelligence: {
      livabilityScore: { type: Number, default: 85 },
      familyFriendlyScore: { type: Number, default: 88 },
      noiseAndPollutionRating: { type: String, default: "Moderate buffer zone" },
      communityVibe: { type: String, default: "Gated luxury cosmopolitan" }
    },
    maintenance: {
      estimatedMonthlyPerSqft: { type: Schema.Types.Mixed, default: "₹4.5 / sqft" },
      agencyName: { type: String, default: "Builder Handover / RWA" }
    },
    resaleIntelligence: {
      demandGrade: { type: String, enum: ["A+", "A", "B+", "B"], default: "A" },
      averageDaysOnMarket: { type: Schema.Types.Mixed, default: "45-60 days" }
    },
    photos: [{ type: String }],
    documents: [
      {
        title: { type: String },
        url: { type: String },
        type: { type: String }
      }
    ],
    reraNumber: { type: String, default: "Verified on HRERA portal" },
    notes: { type: String, default: "" },
    isArchived: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Needs Verification", "Not Verified"],
      default: "Verified"
    },
    lastVerified: { type: Date, default: Date.now },
    source: { type: String, default: "HRERA / Official Master Sales Brochure" },
    dataVersion: { type: Number, default: 1 },
    aiIntelligence: {
      summary: { type: String, default: "" },
      targetBuyerProfile: { type: String, default: "" },
      salesPlaybook: { type: String, default: "" },
      recommendedSellingAngle: { type: String, default: "" },
      frequentlyAskedQuestions: [
        {
          question: { type: String },
          answer: { type: String }
        }
      ],
      alternativeProjects: [
        {
          projectName: { type: String },
          reason: { type: String },
          whatItDoesBetter: { type: String },
          whatItDoesWorse: { type: String },
          idealFor: { type: String }
        }
      ],
      generatedAt: { type: Date, default: Date.now },
      model: { type: String, default: "gemini-3.6-flash" }
    }
  },
  { timestamps: true }
);

ProjectSchema.index({ name: "text", builder: "text", sector: "text" });

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
