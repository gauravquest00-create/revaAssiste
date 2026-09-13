import mongoose, { Document, Schema } from "mongoose";

export interface IFollowUp extends Document {
  lead?: mongoose.Types.ObjectId | string;
  leadName?: string;
  project?: mongoose.Types.ObjectId | string;
  projectName?: string;
  property?: mongoose.Types.ObjectId | string;
  propertyUnit?: string;
  date: Date;
  time: string;
  channel: "Call" | "WhatsApp" | "Email" | "Visit" | "Meeting";
  type: string; // e.g. Price Negotiation, Inventory Check, Client Routine, Document Collection
  reason: string;
  notes?: string;
  message?: string;
  outcome?: string;
  nextFollowUp?: Date;
  status: "Scheduled" | "Completed" | "Pending" | "Rescheduled" | "Cancelled" | "Missed";
  aiRecommendedTiming: string;
}

const FollowUpSchema = new Schema<IFollowUp>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: false },
    leadName: { type: String, default: "None / Standalone" },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: false },
    projectName: { type: String, default: "None" },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: false },
    propertyUnit: { type: String, default: "None" },
    date: { type: Date, required: true },
    time: { type: String, default: "10:30 AM" },
    channel: {
      type: String,
      enum: ["Call", "WhatsApp", "Email", "Visit", "Meeting"],
      default: "Call"
    },
    type: { type: String, default: "Follow-up" },
    reason: { type: String, required: true },
    notes: { type: String, default: "" },
    message: { type: String, default: "" },
    outcome: { type: String, default: "" },
    nextFollowUp: { type: Date },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Pending", "Rescheduled", "Cancelled", "Missed"],
      default: "Scheduled"
    },
    aiRecommendedTiming: { type: String, default: "Morning 10:30 AM - 12:00 PM for optimal response" }
  },
  { timestamps: true }
);

export const FollowUp = mongoose.model<IFollowUp>("FollowUp", FollowUpSchema);
