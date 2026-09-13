/**
 * Safe JSON parser for structured Gemini output.
 * Strips markdown fences (```json ... ```) and sanitizes JSON strings.
 */
export function parseAiJson<T>(rawText: string, fallbackData: T): T {
  if (!rawText || typeof rawText !== "string") {
    return fallbackData;
  }

  try {
    let cleanText = rawText.trim();
    // Strip markdown wrappers
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    cleanText = cleanText.trim();

    return JSON.parse(cleanText) as T;
  } catch (err) {
    console.warn("[AI Parser] Failed to parse AI JSON response, falling back to structured default:", err);
    return fallbackData;
  }
}
