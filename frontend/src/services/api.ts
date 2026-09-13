/**
 * Centralized API Client for REVA ASSISTE.
 * Automatically attaches JWT authentication, points to configured backend,
 * sanitizes URLs, and handles Render cold starts gracefully.
 */

// 1. Smart Base URL resolution & sanitization
let rawUrl = (((import.meta as any).env?.VITE_API_BASE_URL as string) || "").trim();

// If not defined or pointing to localhost on a live production domain (Vercel)
if (!rawUrl || rawUrl.includes("localhost")) {
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    rawUrl = "https://revaassiste.onrender.com/api";
  } else {
    rawUrl = "http://localhost:5000/api";
  }
}

// Strip any trailing slashes
rawUrl = rawUrl.replace(/\/+$/, "");

// Ensure it ends with /api
if (!rawUrl.endsWith("/api")) {
  rawUrl += "/api";
}

export const BASE_URL = rawUrl;

export class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("reva_auth_token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${formattedEndpoint}`;

  let response: Response;
  try {
    response = await fetch(fullUrl, {
      ...options,
      headers
    });
  } catch (err: any) {
    // Graceful error handling for Render cold starts or network dropouts
    if (err instanceof TypeError && err.message.toLowerCase().includes("fetch")) {
      throw new ApiError(
        "Backend server is waking up or unreachable. Please wait 30-40 seconds for Render to spin up, then retry.",
        0,
        { originalUrl: fullUrl }
      );
    }
    throw new ApiError(err.message || "Network request failed", 0, err);
  }

  // Handle Unauthorized Session Expiry
  if (response.status === 401) {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("reva_auth_token");
      localStorage.removeItem("reva_user");
    }
    // Only redirect if not already on the login page
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  // Safe JSON extraction (handles HTML error pages from Render/Vercel)
  let data: any = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = { message: text };
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errorMsg =
      (data && (data.message || data.error)) ||
      (response.status === 502
        ? "Render backend is starting up (Bad Gateway). Please wait 30 seconds."
        : response.status === 503
        ? "Service temporarily unavailable. Please retry in a few moments."
        : `Request failed with status ${response.status}`);

    throw new ApiError(errorMsg, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { method: "GET", ...options }),

  post: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options
    }),

  put: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options
    }),

  patch: <T>(endpoint: string, body?: any, options?: RequestInit) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options
    }),

  delete: <T>(endpoint: string, bodyOrOptions?: any) => {
    // Supports both api.delete(url, { headers, body }) and api.delete(url, payloadObject)
    if (bodyOrOptions && (bodyOrOptions.body || bodyOrOptions.headers)) {
      return request<T>(endpoint, { method: "DELETE", ...bodyOrOptions });
    }
    return request<T>(endpoint, {
      method: "DELETE",
      body: bodyOrOptions !== undefined ? (typeof bodyOrOptions === "string" ? bodyOrOptions : JSON.stringify(bodyOrOptions)) : undefined
    });
  }
};
