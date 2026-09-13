/**
 * Exponential backoff utility for Gemini AI API calls.
 * Handles rate limits (429), server errors (500, 502, 503), timeouts (408), and transient network issues.
 */
export async function withAiRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 1000,
  contextDescription = "Gemini Operation"
): Promise<T> {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxRetries) {
    try {
      attempt++;
      return await operation();
    } catch (error: any) {
      const status = error?.status || error?.statusCode || error?.response?.status;
      const isRateLimit = status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED");
      const isTransient = status === 500 || status === 502 || status === 503 || status === 408 || error?.code === "ETIMEDOUT" || error?.code === "ECONNRESET";

      console.warn(`[AI Retry] ${contextDescription} - Attempt ${attempt} failed with status: ${status || error?.message}`);

      if (attempt >= maxRetries || (!isRateLimit && !isTransient)) {
        throw error;
      }

      // Exponential backoff with jitter
      const jitter = Math.floor(Math.random() * 200);
      const waitTime = isRateLimit ? delay * 2 + jitter : delay + jitter;

      console.log(`[AI Retry] Waiting ${waitTime}ms before attempt ${attempt + 1}...`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      delay = waitTime;
    }
  }

  throw new Error(`[AI Retry] Exhausted ${maxRetries} retries for ${contextDescription}`);
}
