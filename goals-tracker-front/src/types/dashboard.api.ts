export interface ApiHabitTodayResponse {
  name: string;
  completedToday: boolean;
  currentStreak: number;
}

export interface ApiGoalSummaryResponse {
  title: string;
  progressPercentage: number;
  priority: string;
}

export interface ApiDashboardResponse {
  activeGoalsCount: number;
  recentGoals: ApiGoalSummaryResponse[] | null;
  habitsToday: ApiHabitTodayResponse[];
  currentGlobalStreak: number;
  habitsCompletedTodayCount: number;
}
