export type Priority = "low" | "medium" | "high";
export type GoalStatus = "ACTIVE" | "completed" | "abandoned";
export type StepStatus = "todo" | "completed";
export type Frequency = "daily" | "weekly";
export type BadgeType =
  | "finisher"
  | "commitment"
  | "streak_master"
  | "habit_builder"
  | "early_bird"
  | "consistent";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate: string;
  dueDate?: string;
  priority: Priority;
  status: GoalStatus;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Step {
  id: string;
  goalId: string;
  title: string;
  dueDate?: string;
  status: StepStatus;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  frequency: Frequency;
  weeklyTarget?: number; // For weekly frequency
  category: string;
  startDate: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  createdAt: string;
}

export interface Stats {
  completedGoals: number;
  longestStreak: number;
  habitsCompletedToday: number;
  activeGoals: number;
  activeHabits: number;
}

export interface Badge {
  id: BadgeType;
  name: string;
  description: string;
  icon: string;
  requirement: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  badgeId: BadgeType;
  unlockedAt: string;
  seen: boolean;
}

export interface UserProgress {
  userId: string;
  xp: number;
  level: number;
  badges: UserAchievement[];
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  requirement: {
    type: "complete_habits" | "complete_goals" | "maintain_streak";
    target: number;
    days?: number;
  };
}
