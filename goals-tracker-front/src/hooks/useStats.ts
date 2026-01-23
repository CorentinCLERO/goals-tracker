import { useState, useEffect } from "react";
import * as statsApi from "../lib/statsApi";
import type { GlobalStatsResponse, HabitStatsResponse } from "../types/stats.api";

interface UseStatsReturn {
  globalStats: GlobalStatsResponse | null;
  goalsByCategory: Record<string, number> | null;
  habitStats: HabitStatsResponse[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStats = (): UseStatsReturn => {
  const [globalStats, setGlobalStats] = useState<GlobalStatsResponse | null>(null);
  const [goalsByCategory, setGoalsByCategory] = useState<Record<string, number> | null>(null);
  const [habitStats, setHabitStats] = useState<HabitStatsResponse[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [globalStatsData, goalsByCategoryData, habitStatsData] = await Promise.all([
        statsApi.getGlobalStats(),
        statsApi.getGoalsStatsByCategory(),
        statsApi.getHabitStats(),
      ]);

      setGlobalStats(globalStatsData);
      setGoalsByCategory(goalsByCategoryData);
      setHabitStats(habitStatsData);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  return {
    globalStats,
    goalsByCategory,
    habitStats,
    loading,
    error,
    refetch: fetchAllStats,
  };
};