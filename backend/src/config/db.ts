import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("[Database] Connection failed:", error);
    // In production we allow graceful retries or failover
    if (ENV.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};
