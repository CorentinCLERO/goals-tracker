import { User, Goal, Step, Habit, HabitCompletion } from '../types';

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

// Habit functions
export function getHabits(userId: string): Habit[] {
  return getFromStorage<Habit>(KEYS.HABITS).filter(h => h.userId === userId);
}

export function saveHabit(habit: Habit): void {
  const habits = getFromStorage<Habit>(KEYS.HABITS);
  const existingIndex = habits.findIndex(h => h.id === habit.id);
  if (existingIndex >= 0) {
    habits[existingIndex] = habit;
  } else {
    habits.push(habit);
  }
  saveToStorage(KEYS.HABITS, habits);
}

export function deleteHabit(habitId: string): void {
  const habits = getFromStorage<Habit>(KEYS.HABITS);
  saveToStorage(KEYS.HABITS, habits.filter(h => h.id !== habitId));
  
  // Also delete associated completions
  const completions = getFromStorage<HabitCompletion>(KEYS.COMPLETIONS);
  saveToStorage(KEYS.COMPLETIONS, completions.filter(c => c.habitId !== habitId));
}

// Habit completion functions
export function getHabitCompletions(habitId: string): HabitCompletion[] {
  return getFromStorage<HabitCompletion>(KEYS.COMPLETIONS).filter(c => c.habitId === habitId);
}

export function saveHabitCompletion(completion: HabitCompletion): void {
  const completions = getFromStorage<HabitCompletion>(KEYS.COMPLETIONS);
  completions.push(completion);
  saveToStorage(KEYS.COMPLETIONS, completions);
}

export function deleteHabitCompletion(habitId: string, date: string): void {
  const completions = getFromStorage<HabitCompletion>(KEYS.COMPLETIONS);
  saveToStorage(
    KEYS.COMPLETIONS,
    completions.filter(c => !(c.habitId === habitId && c.date === date))
  );
}

export function isHabitCompletedOnDate(habitId: string, date: string): boolean {
  const completions = getHabitCompletions(habitId);
  return completions.some(c => c.date === date);
}
