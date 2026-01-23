import type { User, Goal, Step, Habit, HabitCompletion } from '../types';
import { habitsApiClient } from './habitsApi';
import { toast } from 'sonner';

// LocalStorage keys
const KEYS = {
  CURRENT_USER: 'current_user',
  USERS: 'users',
  GOALS: 'goals',
  STEPS: 'steps',
  HABITS: 'habits',
  COMPLETIONS: 'habit_completions',
};

// Generic storage functions
function getFromStorage<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

// User functions
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }
}

export function getUsers(): User[] {
  return getFromStorage<User>(KEYS.USERS);
}

export function saveUser(user: User): void {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  saveToStorage(KEYS.USERS, users);
}

export function findUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email === email);
}

// Goal functions
export function getGoals(userId: string): Goal[] {
  return getFromStorage<Goal>(KEYS.GOALS).filter(g => g.userId === userId);
}

export function saveGoal(goal: Goal): void {
  const goals = getFromStorage<Goal>(KEYS.GOALS);
  const existingIndex = goals.findIndex(g => g.id === goal.id);
  if (existingIndex >= 0) {
    goals[existingIndex] = goal;
  } else {
    goals.push(goal);
  }
  saveToStorage(KEYS.GOALS, goals);
}

export function deleteGoal(goalId: string): void {
  const goals = getFromStorage<Goal>(KEYS.GOALS);
  saveToStorage(KEYS.GOALS, goals.filter(g => g.id !== goalId));
  
  // Also delete associated steps
  const steps = getFromStorage<Step>(KEYS.STEPS);
  saveToStorage(KEYS.STEPS, steps.filter(s => s.goalId !== goalId));
}

// Step functions
export function getSteps(goalId: string): Step[] {
  return getFromStorage<Step>(KEYS.STEPS).filter(s => s.goalId === goalId);
}

export function saveStep(step: Step): void {
  const steps = getFromStorage<Step>(KEYS.STEPS);
  const existingIndex = steps.findIndex(s => s.id === step.id);
  if (existingIndex >= 0) {
    steps[existingIndex] = step;
  } else {
    steps.push(step);
  }
  saveToStorage(KEYS.STEPS, steps);
}

export function deleteStep(stepId: string): void {
  const steps = getFromStorage<Step>(KEYS.STEPS);
  saveToStorage(KEYS.STEPS, steps.filter(s => s.id !== stepId));
}

// Habit functions - Using API calls
export async function getHabits(): Promise<Habit[]> {
  try {
    return await habitsApiClient.getHabits();
  } catch (error) {
    console.error('Failed to get habits:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to load habits');
    return [];
  }
}

export async function saveHabit(habit: Partial<Habit>): Promise<Habit | null> {
  try {
    // Check if it's an update (has a valid UUID-like ID)
    if (habit.id && habit.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      // Update existing habit
      return await habitsApiClient.updateHabit(habit.id, habit as Habit);
    } else {
      // Create new habit - strip out client-generated fields
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, userId, createdAt, updatedAt, ...habitData } = habit as Habit;
      return await habitsApiClient.createHabit(habitData);
    }
  } catch (error) {
    console.error('Failed to save habit:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to save habit');
    throw error;
  }
}

export async function deleteHabit(habitId: string): Promise<void> {
  try {
    await habitsApiClient.deleteHabit(habitId);
  } catch (error) {
    console.error('Failed to delete habit:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to delete habit');
    throw error;
  }
}

export async function archiveHabit(habitId: string): Promise<Habit> {
  try {
    return await habitsApiClient.archiveHabit(habitId);
  } catch (error) {
    console.error('Failed to archive habit:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to archive habit');
    throw error;
  }
}

// Habit completion functions - Using API calls
export async function getHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
  try {
    return await habitsApiClient.getHabitCompletions(habitId);
  } catch (error) {
    console.error('Failed to get habit completions:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to load completions');
    return [];
  }
}

export async function saveHabitCompletion(completion: HabitCompletion): Promise<HabitCompletion | null> {
  try {
    return await habitsApiClient.logHabitCompletion(completion.habitId, completion.date);
  } catch (error) {
    console.error('Failed to save habit completion:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to log completion');
    return null;
  }
}

export async function deleteHabitCompletion(habitId: string, date: string): Promise<void> {
  try {
    await habitsApiClient.deleteHabitLog(habitId, date);
  } catch (error) {
    console.error('Failed to delete habit completion:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to delete completion');
    throw error;
  }
}

export async function isHabitCompletedOnDate(habitId: string, date: string): Promise<boolean> {
  try {
    return await habitsApiClient.isHabitCompletedOnDate(habitId, date);
  } catch (error) {
    console.error('Failed to check habit completion:', error);
    return false;
  }
}
