import { Request, Response, NextFunction } from "express";
import { ENV } from "../config/env.js";

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Resource not found: [${req.method}] ${req.originalUrl}`
  });
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;

  // Never leak internal stack traces or raw secrets to client
  const clientMessage = err.isOperational || statusCode < 500
    ? err.message
    : "An unexpected server error occurred. Your data is secure. Please try again shortly.";

  console.error(`[Error] [${req.method}] ${req.originalUrl} - ${err.message}`, err.stack);

  res.status(statusCode).json({
    success: false,
    message: clientMessage,
    errorType: err.name || "ServerError",
    ...(ENV.NODE_ENV === "development" ? { details: err.message } : {})
  });
};
