import express from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import corridorRoutes from "./routes/corridorRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import followUpRoutes from "./routes/followUpRoutes.js";
import dealRoutes from "./routes/dealRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(morgan("dev"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    system: "REVA ASSISTE — Real Estate Sales Intelligence System",
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/corridors", corridorRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/followups", followUpRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
