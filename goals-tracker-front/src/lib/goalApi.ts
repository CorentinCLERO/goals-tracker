import type {
  ApiGoalRequest,
  ApiGoalResponse,
  ApiGoalProgressResponse,
  ApiGoalsQueryParams,
} from "../types/goal.api";
import type { ApiError, ExtendedError } from "../types/common.api";

const API_BASE_URL = "http://localhost:8080/api";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: ApiError;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        error: "Unknown error",
        message: `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const error = new Error(
      errorData.message || errorData.error,
    ) as ExtendedError;
    error.status = response.status;
    error.details = errorData.details;
    error.type = errorData.error;
    throw error;
  }

  const contentLength = response.headers.get("content-length");
  if (response.status === 204 || contentLength === "0") {
    return undefined as T;
  }

  const text = await response.text();
  if (!text || text.trim() === "") {
    return undefined as T;
  }

  return JSON.parse(text);
}

export async function getGoals(
  params?: ApiGoalsQueryParams,
): Promise<ApiGoalResponse[]> {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.priority) searchParams.set("priority", params.priority);
  if (params?.sortBy) searchParams.set("sortBy", params.sortBy);
  if (params?.sortDirection)
    searchParams.set("sortDirection", params.sortDirection);

  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
  return apiRequest<ApiGoalResponse[]>(`/goals${query}`);
}

export async function getGoal(goalId: string): Promise<ApiGoalResponse> {
  return apiRequest<ApiGoalResponse>(`/goals/${goalId}`);
}

export async function createGoal(
  goalData: ApiGoalRequest,
): Promise<ApiGoalResponse> {
  return apiRequest<ApiGoalResponse>("/goals", {
    method: "POST",
    body: JSON.stringify(goalData),
  });
}

export async function updateGoal(
  goalId: string,
  goalData: ApiGoalRequest,
): Promise<ApiGoalResponse> {
  return apiRequest<ApiGoalResponse>(`/goals/${goalId}`, {
    method: "PUT",
    body: JSON.stringify(goalData),
  });
}

export async function markGoalAsCompleted(
  goalId: string,
): Promise<ApiGoalResponse> {
  return apiRequest<ApiGoalResponse>(`/goals/${goalId}/completed`, {
    method: "PATCH",
  });
}

export async function deleteGoal(goalId: string): Promise<void> {
  await apiRequest<void>(`/goals/${goalId}`, {
    method: "DELETE",
  });
}

export async function getGoalProgress(
  goalId: string,
): Promise<ApiGoalProgressResponse> {
  return apiRequest<ApiGoalProgressResponse>(`/goals/${goalId}/progress`);
}
