import type { GlobalStatsResponse, HabitStatsResponse } from "../types/stats.api";
import type { ApiError, ExtendedError } from "../types/common.api";
import { API_BASE_URL } from './config';

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

export const getGlobalStats = async (): Promise<GlobalStatsResponse> => {
  return apiRequest<GlobalStatsResponse>('/stats');
};

export const getGoalsStatsByCategory = async (): Promise<Record<string, number>> => {
  return apiRequest<Record<string, number>>('/stats/goals');
};

export const getHabitStats = async (): Promise<HabitStatsResponse[]> => {
  return apiRequest<HabitStatsResponse[]>('/stats/habits');
};