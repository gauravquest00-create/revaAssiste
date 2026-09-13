import mongoose, { Document, Schema } from "mongoose";

export interface IVisit extends Document {
  lead?: mongoose.Types.ObjectId | string;
  leadName?: string;
  project?: mongoose.Types.ObjectId | string;
  projectName?: string;
  property?: mongoose.Types.ObjectId | string;
  propertyUnit?: string;
  date: Date;
  time: string;
  location: string;
  attendees: string[];
  status: "Scheduled" | "Confirmed" | "Completed" | "Rescheduled" | "Cancelled" | "No Show";
  outcome?: string;
  clientFeedback?: string;
  objections?: string[];
  notes?: string;
  nextAction?: string;
  aiAnalysis?: {
    interestLevel: "Very High" | "High" | "Moderate" | "Lukewarm" | "Cold";
    primaryObjection: string;
    preferredPropertyDetails: string;
    decisionMakerReaction: string;
    probabilityChange: string;
    recommendedNextStep: string;
  };
}

const VisitSchema = new Schema<IVisit>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: false },
    leadName: { type: String, default: "None / General Visit" },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: false },
    projectName: { type: String, default: "Dwarka Expressway Corridor" },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: false },
    propertyUnit: { type: String, default: "" },
    date: { type: Date, required: true },
    time: { type: String, default: "11:00 AM" },
    location: { type: String, required: true },
    attendees: [{ type: String }],
    status: {
      type: String,
      enum: ["Scheduled", "Confirmed", "Completed", "Rescheduled", "Cancelled", "No Show"],
      default: "Scheduled"
    },
    outcome: { type: String, default: "" },
    clientFeedback: { type: String, default: "" },
    objections: [{ type: String }],
    notes: { type: String, default: "" },
    nextAction: { type: String, default: "" },
    aiAnalysis: {
      interestLevel: { type: String, default: "High" },
      primaryObjection: { type: String, default: "" },
      preferredPropertyDetails: { type: String, default: "" },
      decisionMakerReaction: { type: String, default: "" },
      probabilityChange: { type: String, default: "+15% closing probability" },
      recommendedNextStep: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export const Visit = mongoose.model<IVisit>("Visit", VisitSchema);
