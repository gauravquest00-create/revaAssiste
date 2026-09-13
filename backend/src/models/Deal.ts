import mongoose, { Document, Schema } from "mongoose";

export interface IDeal extends Document {
  dealCode: string;
  lead: mongoose.Types.ObjectId | string;
  leadName: string;
  project: mongoose.Types.ObjectId | string;
  projectName: string;
  property: mongoose.Types.ObjectId | string;
  propertyUnit: string;
  buyerName: string;
  sellerName: string;
  buyerOffer: number;
  sellerAsk: number;
  counterOffers: Array<{
    offeredBy: "Buyer" | "Seller" | "Consultant Suggestion";
    amount: number;
    date: Date;
    notes?: string;
  }>;
  tokenAmount: number;
  agreementStatus: "Pending" | "Drafted" | "Executed";
  documentationStatus: "Pending KYC" | "KYC Verified" | "NOC Obtained" | "Ready for Registry";
  paymentStatus: "Token Paid" | "10% Agreement Done" | "Stage Payments" | "Fully Paid";
  closingDate?: Date;
  brokeragePercentage: number;
  brokerageAmount: number;
  dealValue: number;
  stage: "Negotiation" | "Token" | "Documentation" | "Payment" | "Closed" | "Fallen Through";
  aiNegotiationAdvice?: {
    openingStrategy: string;
    targetSettlementPrice: number;
    walkAwayConsideration: string;
    recommendedTalkingPoints: string[];
    riskFactor: string;
  };
}

const DealSchema = new Schema<IDeal>(
  {
    dealCode: { type: String, required: true, unique: true },
    lead: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    leadName: { type: String, required: true },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    projectName: { type: String, required: true },
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    propertyUnit: { type: String, required: true },
    buyerName: { type: String, required: true },
    sellerName: { type: String, required: true },
    buyerOffer: { type: Number, required: true },
    sellerAsk: { type: Number, required: true },
    counterOffers: [
      {
        offeredBy: { type: String, enum: ["Buyer", "Seller", "Consultant Suggestion"] },
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        notes: { type: String }
      }
    ],
    tokenAmount: { type: Number, default: 0 },
    agreementStatus: {
      type: String,
      enum: ["Pending", "Drafted", "Executed"],
      default: "Pending"
    },
    documentationStatus: {
      type: String,
      enum: ["Pending KYC", "KYC Verified", "NOC Obtained", "Ready for Registry"],
      default: "Pending KYC"
    },
    paymentStatus: {
      type: String,
      enum: ["Token Paid", "10% Agreement Done", "Stage Payments", "Fully Paid"],
      default: "Token Paid"
    },
    closingDate: { type: Date },
    brokeragePercentage: { type: Number, default: 1.0 },
    brokerageAmount: { type: Number, default: 0 },
    dealValue: { type: Number, required: true },
    stage: {
      type: String,
      enum: ["Negotiation", "Token", "Documentation", "Payment", "Closed", "Fallen Through"],
      default: "Negotiation"
    },
    aiNegotiationAdvice: {
      openingStrategy: { type: String },
      targetSettlementPrice: { type: Number },
      walkAwayConsideration: { type: String },
      recommendedTalkingPoints: [{ type: String }],
      riskFactor: { type: String }
    }
  },
  { timestamps: true }
);

export const Deal = mongoose.model<IDeal>("Deal", DealSchema);
