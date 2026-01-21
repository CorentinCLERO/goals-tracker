import type { Goal, Habit, Step } from "../types";

const API_BASE_URL = "http://localhost:8080/api";
// Helper functions for enum conversion
const mapStatusToBackend = (status: string): string => {
  switch (status) {
    case "in_progress":
      return "ACTIVE";
    case "completed":
      return "COMPLETED";
    case "abandoned":
      return "ABANDONED";
    default:
      return status;
  }
};

const mapStatusToFrontend = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "in_progress";
    case "COMPLETED":
      return "completed";
    case "ABANDONED":
      return "abandoned";
    default:
      return status;
  }
};

const mapPriorityToBackend = (priority: string): string => {
  return priority.toUpperCase();
};

const mapPriorityToFrontend = (priority: string): string => {
  return priority.toLowerCase();
};

const mapFrequencyToBackend = (frequency: string): string => {
  return frequency.toUpperCase();
};

const mapFrequencyToFrontend = (frequency: string): string => {
  return frequency.toLowerCase();
};

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface LoginResponse {
  token: string;
}

interface UserResponse {
  id: string;
  email: string;
  name: string;
  level: number;
  xpPoints: number;
  createdAt: string;
  updatedAt: string;
}

// Backend response interfaces (with uppercase enums)
interface BackendGoal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  deadline?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface BackendHabit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: "DAILY" | "WEEKLY";
  weeklyTarget?: number;
  category: string;
  startDate: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string>;
}

interface ExtendedError extends Error {
  status: number;
  details?: Record<string, string>;
  type?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage on initialization
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
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
        // If response is not JSON, create a generic error
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

    // Handle responses without content (like 204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.removeItem("auth_token");
      }
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.request<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      this.setToken(response.token);
      return response;
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 400 && apiError.type === "Validation failed") {
        throw new Error("Veuillez vérifier vos informations de connexion.");
      }
      if (apiError.status === 401 && apiError.type === "Invalid credentials") {
        throw new Error("Email ou mot de passe incorrect.");
      }
      if (apiError.status === 500) {
        throw new Error("Email ou mot de passe incorrect.");
      }
      throw new Error(apiError.message || "Erreur lors de la connexion.");
    }
  }

  async register(userData: RegisterRequest): Promise<UserResponse> {
    try {
      const response = await this.request<UserResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 409 && apiError.type === "Email already exists") {
        throw new Error("Cet email est déjà utilisé.");
      }
      if (apiError.status === 400 && apiError.type === "Validation failed") {
        // Handle validation errors
        if (apiError.details) {
          const validationErrors = Object.values(apiError.details);
          throw new Error(validationErrors.join(", "));
        }
        throw new Error("Veuillez vérifier vos informations.");
      }
      throw new Error(apiError.message || "Erreur lors de l'inscription.");
    }
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me");
  }

  async getGoals(): Promise<Goal[]> {
    const goals = await this.request<BackendGoal[]>("/goals");
    // Map backend enum values to frontend format
    return goals.map((goal) => ({
      ...goal,
      status: mapStatusToFrontend(goal.status) as Goal["status"],
      priority: mapPriorityToFrontend(goal.priority) as Goal["priority"],
    }));
  }

  async createGoal(
    goal: Omit<Goal, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Goal> {
    // Map frontend fields to backend format
    const apiData = {
      ...goal,
      status: mapStatusToBackend(goal.status),
      priority: mapPriorityToBackend(goal.priority),
    };
    const createdGoal = await this.request<BackendGoal>("/goals", {
      method: "POST",
      body: JSON.stringify(apiData),
    });
    // Map backend enum values to frontend format
    return {
      ...createdGoal,
      status: mapStatusToFrontend(createdGoal.status) as Goal["status"],
      priority: mapPriorityToFrontend(createdGoal.priority) as Goal["priority"],
    };
  }

  async getGoal(id: string): Promise<Goal> {
    const goal = await this.request<BackendGoal>(`/goals/${id}`);
    // Map backend enum values to frontend format
    return {
      ...goal,
      status: mapStatusToFrontend(goal.status) as Goal["status"],
      priority: mapPriorityToFrontend(goal.priority) as Goal["priority"],
    };
  }

  async updateGoal(id: string, goal: Partial<Goal>): Promise<Goal> {
    // Map frontend enum values to backend format
    const apiData = {
      ...goal,
      status: goal.status ? mapStatusToBackend(goal.status) : undefined,
      priority: goal.priority ? mapPriorityToBackend(goal.priority) : undefined,
    };
    const updatedGoal = await this.request<BackendGoal>(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiData),
    });
    // Map backend enum values to frontend format
    return {
      ...updatedGoal,
      status: mapStatusToFrontend(updatedGoal.status) as Goal["status"],
      priority: mapPriorityToFrontend(updatedGoal.priority) as Goal["priority"],
    };
  }

  async deleteGoal(id: string): Promise<void> {
    return this.request<void>(`/goals/${id}`, {
      method: "DELETE",
    });
  }

  async markGoalCompleted(id: string): Promise<Goal> {
    const goal = await this.request<BackendGoal>(`/goals/${id}/completed`, {
      method: "PUT",
    });
    // Map backend enum values to frontend format
    return {
      ...goal,
      status: mapStatusToFrontend(goal.status) as Goal["status"],
      priority: mapPriorityToFrontend(goal.priority) as Goal["priority"],
    };
  }

  async getHabits(): Promise<Habit[]> {
    const habits = await this.request<BackendHabit[]>("/habits");
    // Map backend fields to frontend format
    return habits.map((habit) => ({
      ...habit,
      frequency: mapFrequencyToFrontend(habit.frequency) as Habit["frequency"],
    }));
  }

  async createHabit(
    habit: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">,
  ): Promise<Habit> {
    // Map frontend fields to backend format
    const apiData = {
      ...habit,
      frequency: mapFrequencyToBackend(habit.frequency),
    };
    const createdHabit = await this.request<BackendHabit>("/habits", {
      method: "POST",
      body: JSON.stringify(apiData),
    });
    // Map backend response to frontend format
    return {
      ...createdHabit,
      frequency: mapFrequencyToFrontend(
        createdHabit.frequency,
      ) as Habit["frequency"],
    };
  }

  async updateHabit(id: string, habit: Partial<Habit>): Promise<Habit> {
    // Map frontend fields to backend format
    const apiData = {
      ...habit,
      frequency: habit.frequency
        ? mapFrequencyToBackend(habit.frequency)
        : undefined,
    };
    const updatedHabit = await this.request<BackendHabit>(`/habits/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiData),
    });
    // Map backend response to frontend format
    return {
      ...updatedHabit,
      frequency: mapFrequencyToFrontend(
        updatedHabit.frequency,
      ) as Habit["frequency"],
    };
  }

  async getSteps(goalId: string): Promise<Step[]> {
    return this.request<Step[]>(`/goals/${goalId}/steps`);
  }

  async createStep(
    goalId: string,
    step: { title: string; deadline?: string; position: number },
  ): Promise<Step> {
    const stepData = {
      title: step.title,
      deadline: step.deadline,
      position: step.position,
      isCompleted: false,
    };

    return this.request<Step>(`/goals/${goalId}/steps`, {
      method: "POST",
      body: JSON.stringify(stepData),
    });
  }

  async updateStep(
    goalId: string,
    stepId: string,
    step: Partial<Step>,
  ): Promise<Step> {
    return this.request<Step>(`/goals/${goalId}/steps/${stepId}`, {
      method: "PATCH",
      body: JSON.stringify(step),
    });
  }

  async markStepCompleted(goalId: string, stepId: string): Promise<Step> {
    return this.request<Step>(`/goals/${goalId}/steps/${stepId}/complete`, {
      method: "PATCH",
    });
  }

  async markStepUncompleted(goalId: string, stepId: string): Promise<Step> {
    return this.request<Step>(`/goals/${goalId}/steps/${stepId}/uncomplete`, {
      method: "PATCH",
    });
  }

  async deleteStep(goalId: string, stepId: string): Promise<void> {
    return this.request<void>(`/goals/${goalId}/steps/${stepId}`, {
      method: "DELETE",
    });
  }

  logout() {
    this.setToken(null);
  }
}

export const apiClient = new ApiClient();
