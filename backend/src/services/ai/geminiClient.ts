import { GoogleGenAI } from "@google/genai";
import { ENV } from "../../config/env.js";

let clientInstance: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI | null => {
  if (!ENV.GEMINI_API_KEY) {
    console.warn("[Gemini AI] GEMINI_API_KEY not configured. System will utilize verified heuristic fallback engine.");
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
    } catch (error) {
      console.error("[Gemini AI] Failed to initialize GoogleGenAI client:", error);
      return null;
    }
  }

  return clientInstance;
};

export const getGeminiModel = (): string => {
  return ENV.GEMINI_MODEL || "gemini-3.6-flash";
};
