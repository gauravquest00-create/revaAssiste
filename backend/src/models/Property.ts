import mongoose, { Document, Schema } from "mongoose";

export interface IProperty extends Document {
  propertyId: string;
  project: mongoose.Types.ObjectId | string;
  projectName: string;
  corridor: mongoose.Types.ObjectId | string;
  corridorName: string;
  tower: string;
  floor: number;
  totalFloors?: number;
  unit: string;
  bhk: string;
  area: number; // in sq ft
  facing: string; // North, North-East, East, Park Facing, etc.
  view: string;
  furnishing: "Bare Shell" | "Semi-Furnished" | "Fully Furnished";
  parking: string;
  askingPrice: number;
  expectedPrice: number;
  lowestExpectedPrice: number;
  pricePerSqft: number;
  seller: {
    name: string;
    contact: string;
    urgency: "High" | "Moderate" | "Low" | "Immediate Distress";
    brokeragePercentage: number;
  };
  availability: "Available" | "Under Offer" | "Sold" | "Archived";
  photos: string[];
  documents: Array<{ title: string; url: string; type: string }>;
  notes: string;
  isArchived?: boolean;
  verificationStatus: "Verified" | "Needs Verification" | "Not Verified";
  lastVerified: Date;
  status: "Available" | "Under Offer" | "Sold" | "Archived";
  aiSuitabilityScore?: number;
  aiSuitabilityReason?: string;
}

const PropertySchema = new Schema<IProperty>(
  {
    propertyId: { type: String, required: true, unique: true, trim: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    projectName: { type: String, required: true },
    corridor: { type: Schema.Types.ObjectId, ref: "Corridor" },
    corridorName: { type: String, default: "Dwarka Expressway" },
    tower: { type: String, required: true },
    floor: { type: Number, required: true },
    totalFloors: { type: Number, default: 25 },
    unit: { type: String, required: true },
    bhk: { type: String, required: true },
    area: { type: Number, required: true },
    facing: { type: String, default: "Park Facing" },
    view: { type: String, default: "Club & Green View" },
    furnishing: {
      type: String,
      enum: ["Bare Shell", "Semi-Furnished", "Fully Furnished"],
      default: "Semi-Furnished"
    },
    parking: { type: String, default: "2 Covered Dedicated" },
    askingPrice: { type: Number, required: true },
    expectedPrice: { type: Number, required: true },
    lowestExpectedPrice: { type: Number, required: true },
    pricePerSqft: { type: Number, required: true },
    seller: {
      name: { type: String, required: true },
      contact: { type: String, default: "Not verified" },
      urgency: {
        type: String,
        enum: ["High", "Moderate", "Low", "Immediate Distress"],
        default: "Moderate"
      },
      brokeragePercentage: { type: Number, default: 1.0 }
    },
    availability: {
      type: String,
      enum: ["Available", "Under Offer", "Sold", "Archived"],
      default: "Available"
    },
    photos: [{ type: String }],
    documents: [{ title: String, url: String, type: { type: String } }],
    notes: { type: String, default: "" },
    isArchived: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["Verified", "Needs Verification", "Not Verified"],
      default: "Verified"
    },
    lastVerified: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Available", "Under Offer", "Sold", "Archived"],
      default: "Available"
    }
  },
  { timestamps: true }
);

PropertySchema.index({ projectName: 1, askingPrice: 1, bhk: 1 });

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
