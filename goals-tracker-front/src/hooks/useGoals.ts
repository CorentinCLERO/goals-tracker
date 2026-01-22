import { useState, useEffect, useCallback } from "react";
import type { Goal, Priority, GoalStatus } from "../types";
import type { ApiGoalResponse, ApiGoalsQueryParams } from "../types/goal.api";
import * as goalApi from "../lib/goalApi";

function mapApiGoalToGoal(apiGoal: ApiGoalResponse): Goal {
  return {
    id: apiGoal.id,
    userId: "",
    title: apiGoal.title,
    description: apiGoal.description || undefined,
    startDate: apiGoal.startDate,
    dueDate: apiGoal.deadline || undefined,
    priority: apiGoal.priority.toLowerCase() as Priority,
    status: apiGoal.status.toLowerCase() as GoalStatus,
    category: apiGoal.category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function mapGoalToApiRequest(goal: Goal) {
  const formatToDateTime = (dateString: string) => {
    if (!dateString) return new Date().toISOString().slice(0, 19);

    if (dateString.includes("T")) {
      return dateString.slice(0, 19);
    }

    return `${dateString}T00:00:00`;
  };

  return {
    title: goal.title,
    description: goal.description || "",
    category: goal.category,
    priority: goal.priority.toUpperCase(),
    status: goal.status.toUpperCase(),
    startDate: formatToDateTime(goal.startDate),
    deadline: formatToDateTime(goal.dueDate || goal.startDate),
  };
}

export function useGoals(filters?: {
  status?: string;
  priority?: string;
  sortBy?: string;
}) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: ApiGoalsQueryParams = {
        status:
          filters?.status && filters.status !== "all"
            ? filters.status.toUpperCase()
            : undefined,
        priority:
          filters?.priority && filters.priority !== "all"
            ? filters.priority.toUpperCase()
            : undefined,
        sortBy: filters?.sortBy === "dueDate" ? "deadline" : filters?.sortBy,
        sortDirection: "asc",
      };

      const apiGoals = await goalApi.getGoals(params);
      const mappedGoals = (apiGoals || []).map(mapApiGoalToGoal);
      setGoals(mappedGoals);
    } catch (err) {
      console.error("Error loading goals:", err);
      setError(err instanceof Error ? err.message : "Failed to load goals");
    } finally {
      setLoading(false);
    }
  }, [filters?.status, filters?.priority, filters?.sortBy]);

  const createGoal = useCallback(
    async (goal: Goal): Promise<void> => {
      try {
        const apiRequest = mapGoalToApiRequest(goal);
        await goalApi.createGoal(apiRequest);
        await loadGoals();
      } catch (err) {
        console.error("Error creating goal:", err);
        throw err;
      }
    },
    [loadGoals],
  );

  const updateGoal = useCallback(
    async (goal: Goal): Promise<void> => {
      try {
        const apiRequest = mapGoalToApiRequest(goal);
        await goalApi.updateGoal(goal.id, apiRequest);
        await loadGoals();
      } catch (err) {
        console.error("Error updating goal:", err);
        throw err;
      }
    },
    [loadGoals],
  );

  const deleteGoal = useCallback(
    async (goalId: string): Promise<void> => {
      try {
        await goalApi.deleteGoal(goalId);
        await loadGoals();
      } catch (err) {
        console.error("Error deleting goal:", err);
        throw err;
      }
    },
    [loadGoals],
  );

  const markGoalAsCompleted = useCallback(
    async (goalId: string): Promise<void> => {
      try {
        await goalApi.markGoalAsCompleted(goalId);
        await loadGoals();
      } catch (err) {
        console.error("Error marking goal as completed:", err);
        throw err;
      }
    },
    [loadGoals],
  );

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return {
    goals,
    loading,
    error,
    refetch: loadGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    markGoalAsCompleted,
  };
}

export function useGoalProgress(goalId: string) {
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    if (!goalId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await goalApi.getGoalProgress(goalId);
      setProgress(result.progress);
    } catch (err) {
      console.error("Error loading goal progress:", err);
      setError(err instanceof Error ? err.message : "Failed to load progress");
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  return {
    progress,
    loading,
    error,
    refetch: loadProgress,
  };
}
