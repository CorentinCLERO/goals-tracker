import type { Habit, HabitCompletion } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  completionRate: number;
  totalCompletions: number;
}

class HabitsApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
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

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

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

    return response.json();
  }

  // GET /api/habits - Liste des habitudes
  async getHabits(): Promise<Habit[]> {
    try {
      return await this.request<Habit[]>("/habits");
    } catch (error) {
      const apiError = error as ExtendedError;
      throw new Error(
        apiError.message || "Erreur lors de la récupération des habitudes.",
      );
    }
  }

  // GET /api/habits/:id - Détails d'une habitude
  async getHabit(habitId: string): Promise<Habit> {
    try {
      return await this.request<Habit>(`/habits/${habitId}`);
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la récupération de l'habitude.",
      );
    }
  }

  // POST /api/habits - Créer une habitude
  async createHabit(habit: Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">): Promise<Habit> {
    try {
      return await this.request<Habit>("/habits", {
        method: "POST",
        body: JSON.stringify(habit),
      });
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 400) {
        throw new Error("Données invalides. Veuillez vérifier le formulaire.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la création de l'habitude.",
      );
    }
  }

  // PUT /api/habits/:id - Modifier une habitude
  async updateHabit(
    habitId: string,
    habit: Partial<Omit<Habit, "id" | "userId" | "createdAt" | "updatedAt">>,
  ): Promise<Habit> {
    try {
      return await this.request<Habit>(`/habits/${habitId}`, {
        method: "PUT",
        body: JSON.stringify(habit),
      });
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      if (apiError.status === 400) {
        throw new Error("Données invalides. Veuillez vérifier le formulaire.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la modification de l'habitude.",
      );
    }
  }

  // DELETE /api/habits/:id - Supprimer une habitude
  async deleteHabit(habitId: string): Promise<void> {
    try {
      await this.request<void>(`/habits/${habitId}`, {
        method: "DELETE",
      });
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la suppression de l'habitude.",
      );
    }
  }

  // PATCH /api/habits/:id/archive - Archiver une habitude
  async archiveHabit(habitId: string): Promise<Habit> {
    try {
      return await this.request<Habit>(`/habits/${habitId}/archive`, {
        method: "PATCH",
      });
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      throw new Error(
        apiError.message || "Erreur lors de l'archivage de l'habitude.",
      );
    }
  }

  // POST /api/habits/:id/log - Marquer habitude complétée (aujourd'hui)
  async logHabitCompletion(habitId: string, date?: string): Promise<HabitCompletion> {
    try {
      const body = date ? JSON.stringify({ date }) : undefined;
      const response = await this.request<HabitCompletion>(`/habits/${habitId}/log`, {
        method: "POST",
        body,
      });
      
      // Map backend response to HabitCompletion format
      return {
        id: response.id,
        habitId: habitId,
        date: response.date, // Backend returns YYYY-MM-DD string
        createdAt: response.createdAt || new Date().toISOString(),
      };
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      if (apiError.status === 409) {
        throw new Error("Cette habitude est déjà complétée pour cette date.");
      }
      throw new Error(
        apiError.message || "Erreur lors de l'enregistrement de la complétion.",
      );
    }
  }

  // GET /api/habits/:id/logs - Historique des logs
  async getHabitLogs(
    habitId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<HabitCompletion[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      
      const queryString = params.toString();
      const endpoint = `/habits/${habitId}/logs${queryString ? `?${queryString}` : ""}`;
      
      const logs = await this.request<HabitCompletion[]>(endpoint);
      
      // Map backend response to HabitCompletion format
      return logs.map(log => ({
        id: log.id,
        habitId: habitId,
        date: log.date, // Backend returns YYYY-MM-DD string
        createdAt: log.createdAt || new Date().toISOString(),
      }));
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la récupération des logs.",
      );
    }
  }

  // DELETE /api/habits/:id/log/:date - Annuler un log
  async deleteHabitLog(habitId: string, date: string): Promise<void> {
    try {
      await this.request<void>(`/habits/${habitId}/log/${date}`, {
        method: "DELETE",
      });
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Log non trouvé.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la suppression du log.",
      );
    }
  }

  // GET /api/habits/:id/stats - Statistiques (streak, taux complétion)
  async getHabitStats(habitId: string): Promise<HabitStats> {
    try {
      return await this.request<HabitStats>(`/habits/${habitId}/stats`);
    } catch (error) {
      const apiError = error as ExtendedError;
      if (apiError.status === 404) {
        throw new Error("Habitude non trouvée.");
      }
      throw new Error(
        apiError.message || "Erreur lors de la récupération des statistiques.",
      );
    }
  }

  // Helper method: Check if habit is completed on a specific date
  async isHabitCompletedOnDate(habitId: string, date: string): Promise<boolean> {
    try {
      const logs = await this.getHabitLogs(habitId, date, date);
      return logs.some((log) => log.date === date);
    } catch {
      return false;
    }
  }

  // Helper method: Get completions for a habit
  async getHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
    return this.getHabitLogs(habitId);
  }
}

export const habitsApiClient = new HabitsApiClient();

// Convenience exports matching the original storage functions
export const getHabits = () => habitsApiClient.getHabits();
export const saveHabit = (habit: Habit) => 
  habit.id ? habitsApiClient.updateHabit(habit.id, habit) : habitsApiClient.createHabit(habit);
export const deleteHabit = (habitId: string) => habitsApiClient.deleteHabit(habitId);
export const getHabitCompletions = (habitId: string) => habitsApiClient.getHabitCompletions(habitId);
export const saveHabitCompletion = (habitId: string, date?: string) => 
  habitsApiClient.logHabitCompletion(habitId, date);
export const deleteHabitCompletion = (habitId: string, date: string) => 
  habitsApiClient.deleteHabitLog(habitId, date);
export const isHabitCompletedOnDate = (habitId: string, date: string) => 
  habitsApiClient.isHabitCompletedOnDate(habitId, date);
