export type Priority = 'low' | 'medium' | 'high';
export type GoalStatus = 'in_progress' | 'completed' | 'abandoned';
export type StepStatus = 'todo' | 'completed';
export type Frequency = 'daily' | 'weekly';

export interface User {
  id: string;
  email: string;
  name: string;
  level?: number;
  xpPoints?: number;
  createdAt: string;
  updatedAt?: string;
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
