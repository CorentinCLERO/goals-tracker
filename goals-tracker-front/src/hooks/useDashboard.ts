import { useState, useEffect, useCallback } from "react";
import type { ApiDashboardResponse } from "../types/dashboard.api";
import * as dashboardApi from "../lib/dashboardApi";

export interface DashboardStats {
  activeGoalsCount: number;
  currentGlobalStreak: number;
  habitsCompletedTodayCount: number;
  totalHabitsToday: number;
}

export interface HabitToday {
  name: string;
  completedToday: boolean;
  currentStreak: number;
}

export interface GoalSummary {
  title: string;
  progressPercentage: number;
  priority: 'low' | 'medium' | 'high';
}

export interface DashboardData {
  stats: DashboardStats;
  habitsToday: HabitToday[];
  recentGoals: GoalSummary[];
}

function mapApiDashboardToDashboard(apiData: ApiDashboardResponse): DashboardData {
  const habitsToday: HabitToday[] = apiData.habitsToday.map(habit => ({
    name: habit.name,
    completedToday: habit.completedToday,
    currentStreak: habit.currentStreak,
  }));

  const recentGoals: GoalSummary[] = (apiData.recentGoals || []).map(goal => ({
    title: goal.title,
    progressPercentage: goal.progressPercentage,
    priority: goal.priority.toLowerCase() as 'low' | 'medium' | 'high',
  }));

  const stats: DashboardStats = {
    activeGoalsCount: apiData.activeGoalsCount,
    currentGlobalStreak: apiData.currentGlobalStreak,
    habitsCompletedTodayCount: apiData.habitsCompletedTodayCount,
    totalHabitsToday: habitsToday.length,
  };

  return {
    stats,
    habitsToday,
    recentGoals,
  };
}

export function useDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      activeGoalsCount: 0,
      currentGlobalStreak: 0,
      habitsCompletedTodayCount: 0,
      totalHabitsToday: 0,
    },
    habitsToday: [],
    recentGoals: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiData = await dashboardApi.getDashboardData();
      const mappedData = mapApiDashboardToDashboard(apiData);
      setDashboardData(mappedData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboardData,
    loading,
    error,
    refetch: loadDashboard,
  };
}