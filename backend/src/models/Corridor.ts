import mongoose, { Document, Schema } from "mongoose";

export interface ICorridor extends Document {
  name: string;
  slug: string;
  description: string;
  location: string;
  sectors: string[];
  connectivity: {
    metro: string[];
    airportAccess: string;
    highways: string[];
    cprDistance?: string;
  };
  infrastructure: {
    employmentHubs: string[];
    schools: string[];
    hospitals: string[];
    retail: string[];
    futureProjects: string[];
  };
  marketIntelligence: {
    avgPriceSqft: number;
    priceRange: string;
    rentalYield: string;
    annualAppreciation: string;
    endUseSuitability: string;
    investmentSuitability: string;
    demandLevel: "High" | "Moderate" | "Very High";
    liquidity: "High" | "Moderate" | "Low";
    marketRisks: string[];
  };
  aiAnalysis: {
    overview: string;
    topSellingAngle: string;
    keyGrowthDrivers: string[];
    generatedAt: Date;
  };
  isArchived?: boolean;
  verificationStatus: "Verified" | "Needs Verification" | "Not Verified";
  lastVerified: Date;
  source: string;
}

const CorridorSchema = new Schema<ICorridor>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    sectors: [{ type: String }],
    connectivity: {
      metro: [{ type: String }],
      airportAccess: { type: String, default: "Not verified" },
      highways: [{ type: String }],
      cprDistance: { type: String, default: "Direct access" }
    },
    infrastructure: {
      employmentHubs: [{ type: String }],
      schools: [{ type: String }],
      hospitals: [{ type: String }],
      retail: [{ type: String }],
      futureProjects: [{ type: String }]
    },
    marketIntelligence: {
      avgPriceSqft: { type: Number, default: 14000 },
      priceRange: { type: String, default: "₹1.5 Cr – ₹6.0 Cr" },
      rentalYield: { type: String, default: "3.8% – 4.5%" },
      annualAppreciation: { type: String, default: "12% – 16%" },
      endUseSuitability: { type: String, default: "High" },
      investmentSuitability: { type: String, default: "Very High" },
      demandLevel: { type: String, enum: ["High", "Moderate", "Very High"], default: "Very High" },
      liquidity: { type: String, enum: ["High", "Moderate", "Low"], default: "High" },
      marketRisks: [{ type: String }]
    },
    aiAnalysis: {
      overview: { type: String, default: "" },
      topSellingAngle: { type: String, default: "" },
      keyGrowthDrivers: [{ type: String }],
      generatedAt: { type: Date, default: Date.now }
    },
    isArchived: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Needs Verification", "Not Verified"],
      default: "Verified"
    },
    lastVerified: { type: Date, default: Date.now },
    source: { type: String, default: "Gurugram Master Plan 2031 / GMDA Records" }
  },
  { timestamps: true }
);

export const Corridor = mongoose.model<ICorridor>("Corridor", CorridorSchema);
