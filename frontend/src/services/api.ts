/**
 * Centralized API Client for REVA ASSISTE.
 * Automatically attaches JWT authentication and points to configured backend.
 */
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

class ApiError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("reva_auth_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.status === 401) {
    // If expired or unauthorized, clean local token and redirect to login
    localStorage.removeItem("reva_auth_token");
    localStorage.removeItem("reva_user");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || "An error occurred with your request", response.status, data);
  }

  return data;
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
    if (bodyOrOptions && (bodyOrOptions.body || bodyOrOptions.headers)) {
      return request<T>(endpoint, { method: "DELETE", ...bodyOrOptions });
    }
    return request<T>(endpoint, {
      method: "DELETE",
      body: bodyOrOptions !== undefined ? (typeof bodyOrOptions === "string" ? bodyOrOptions : JSON.stringify(bodyOrOptions)) : undefined
    });
  }
};
