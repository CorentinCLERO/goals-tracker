export interface GlobalStatsResponse {
  totalGoalsCompleted: number;
  totalHabitLogs: number;
  globalSuccessRate: number;
  longestStreakRecord: number;
  totalXP: number;
}

export interface HabitStatsResponse {
  habitName: string;
  currentStreak: number;
  completionRate: number;
  longestStreak: number;
  totalCompleted: number;
}