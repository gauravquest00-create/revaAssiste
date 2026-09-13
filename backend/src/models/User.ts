import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: "admin" | "consultant" | "advisor";
  organization?: string;
  avatar?: string;
  settings: {
    notificationsEnabled: boolean;
    defaultCorridor: string;
    preferredCurrency: string;
  };
  comparePassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, default: "" },
    role: { type: String, enum: ["admin", "consultant", "advisor"], default: "consultant" },
    organization: { type: String, default: "LuxuryNest Real Estate" },
    avatar: { type: String, default: "" },
    settings: {
      notificationsEnabled: { type: Boolean, default: true },
      defaultCorridor: { type: String, default: "Dwarka Expressway" },
      preferredCurrency: { type: String, default: "INR" }
    }
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
