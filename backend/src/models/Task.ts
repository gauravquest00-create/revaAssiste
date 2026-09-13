import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  lead?: mongoose.Types.ObjectId | string;
  leadName?: string;
  title: string;
  type: "Call" | "Pitch" | "Follow-up" | "Visit" | "Negotiation" | "General";
  why: string;
  whatToDo: string;
  whatToSay: string;
  whatToAsk: string;
  whatNotToSay: string;
  expectedOutcome: string;
  recommendedNextStep: string;
  status: "Pending" | "Completed" | "Dismissed";
  priority: "High" | "Medium" | "Low";
  dueDate: Date;
  completedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    leadName: { type: String, default: "General Sales" },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["Call", "Pitch", "Follow-up", "Visit", "Negotiation", "General"],
      default: "Call"
    },
    why: { type: String, required: true },
    whatToDo: { type: String, required: true },
    whatToSay: { type: String, required: true },
    whatToAsk: { type: String, required: true },
    whatNotToSay: { type: String, default: "Do not sound pushy or reveal bottom price" },
    expectedOutcome: { type: String, required: true },
    recommendedNextStep: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Completed", "Dismissed"], default: "Pending" },
    priority: { type: String, enum: ["High", "Medium", "Low"], default: "High" },
    dueDate: { type: Date, default: Date.now },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
