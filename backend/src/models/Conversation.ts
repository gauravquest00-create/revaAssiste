import mongoose, { Document, Schema } from "mongoose";

export interface IConversation extends Document {
  lead: mongoose.Types.ObjectId | string;
  leadName: string;
  rawInput: string;
  extractedData: {
    budget: string;
    purpose: string;
    projectInterest: string;
    objection: string;
    decisionMaker: string;
    visitDate: string;
    intent: "High" | "Moderate" | "Low";
    temperature: "Hot" | "Warm" | "Cold";
  };
  recommendedNextAction: string;
  salesTip: string;
  timestamp: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    leadName: { type: String, required: true },
    rawInput: { type: String, required: true },
    extractedData: {
      budget: { type: String, default: "Not specified" },
      purpose: { type: String, default: "End Use" },
      projectInterest: { type: String, default: "" },
      objection: { type: String, default: "None detected" },
      decisionMaker: { type: String, default: "Self" },
      visitDate: { type: String, default: "Upcoming weekend" },
      intent: { type: String, enum: ["High", "Moderate", "Low"], default: "High" },
      temperature: { type: String, enum: ["Hot", "Warm", "Cold"], default: "Hot" }
    },
    recommendedNextAction: { type: String, required: true },
    salesTip: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);
