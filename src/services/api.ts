import { API_BASE } from "@/components/custom/Main";

type AuthPayload = {
  cookies: string;
  authorizedID: string;
  csrf: string;
};

/**
 * Core authenticated POST request wrapper for AmazeCC API.
 */
export async function fetchAmazeCC<T>(endpoint: string, payload: AuthPayload & Record<string, any>): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`AmazeCC API Error: HTTP ${response.status} at ${endpoint}`);
  }

  return response.json();
}

/**
 * Core unauthenticated GET request wrapper for AmazeCC API.
 */
export async function fetchAmazeCCGet<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
  const response = await fetch(`${API_BASE}${endpoint}${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`AmazeCC API Error: HTTP ${response.status} at ${endpoint}`);
  }

  return response.json();
}

// ==========================================
// QBank Endpoints (Prepared for future UI)
// ==========================================

export const qbankApi = {
  getCourses: () => fetchAmazeCCGet("/api/qbank/courses"),
  getPapers: (course: string) => fetchAmazeCCGet("/api/qbank/papers", { course }),
  getQuestions: (course: string) => fetchAmazeCCGet("/api/qbank/questions", { course }),
};

// ==========================================
// Additional Supported Modules
// ==========================================

export const studentApi = {
  getProfile: (payload: AuthPayload) => fetchAmazeCC("/api/student", payload),
  getCredentials: (payload: AuthPayload) => fetchAmazeCC("/api/credentials", payload),
};

export const circularsApi = {
  getCirculars: (payload: AuthPayload) => fetchAmazeCC("/api/circulars", payload),
};

export const busesApi = {
  getBuses: () => fetchAmazeCCGet("/api/buses"),
};
