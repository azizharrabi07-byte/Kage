/**
 * Kage Backend API Client
 * Communicates with FastAPI backend (http://localhost:8000 by default)
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token: explicitToken, ...fetchOptions } = options;

  // Prefer explicit token, otherwise use global auth store
  let token = explicitToken;
  if (!token) {
    try {
      const { authTokenStore } = await import('../auth/authToken');
      token = authTokenStore.getToken();
    } catch {}
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...fetchOptions.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${res.status}`);
  }

  return res.json();
}

// ====================== AI ======================
export interface ModelThinkingRequest {
  profile: {
    age?: number;
    height_cm?: number;
    weight_kg?: number;
    experience_level?: string;
    primary_goal?: string;
    injuries?: string;
    active_program_id?: string;
  };
  additional_context?: string;
}

export const aiApi = {
  runModelThinking: (data: ModelThinkingRequest, token?: string) =>
    apiRequest("/ai/model-thinking", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
};

// ====================== DIET ======================
export interface DietRecommendationRequest {
  profile: {
    age?: number;
    height_cm?: number;
    weight_kg?: number;
    experience_level?: string;
    primary_goal?: string;
  };
}

export const dietApi = {
  getRecommendation: (data: DietRecommendationRequest, token?: string) =>
    apiRequest("/diet/recommendation", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),
};

// ====================== PROGRAMS ======================
export const programsApi = {
  list: () => apiRequest("/programs/"),
  getById: (id: string) => apiRequest(`/programs/${id}`),
  getActive: (token?: string) => apiRequest("/programs/active", { token }),
};

// ====================== WORKOUTS ======================
export interface WorkoutSessionPayload {
  program_id?: string;
  name: string;
  duration_seconds: number;
  exercises: any[]; // matches backend WorkoutExercise shape
  total_xp?: number;
  mastery?: any;
  notes?: string;
}

export const workoutsApi = {
  logSession: (data: WorkoutSessionPayload, token?: string) =>
    apiRequest("/workouts/", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }),

  getRecent: (token?: string) =>
    apiRequest("/workouts/recent", { token }),

  getPRs: (token?: string) =>
    apiRequest("/workouts/prs", { token }),
};

export default {
  ai: aiApi,
  diet: dietApi,
  programs: programsApi,
  workouts: workoutsApi,
};
