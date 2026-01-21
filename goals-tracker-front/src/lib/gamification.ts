import type { Badge, BadgeType, UserProgress, UserAchievement, Challenge } from '../types';
import { getGoals, getHabits, getHabitCompletions } from './storage';
import { calculateStreak } from './utils-habit';

// Badge definitions
export const BADGES: Badge[] = [
  {
    id: 'finisher',
    name: 'Finisher',
    description: 'Complete 5 goals',
    icon: '🏆',
    requirement: 'Complete 5 goals',
  },
  {
    id: 'commitment',
    name: 'Commitment',
    description: 'Maintain a 30-day streak on any habit',
    icon: '💪',
    requirement: '30-day streak on any habit',
  },
  {
    id: 'streak_master',
    name: 'Streak Master',
    description: 'Maintain a 100-day streak on any habit',
    icon: '🔥',
    requirement: '100-day streak on any habit',
  },
  {
    id: 'habit_builder',
    name: 'Habit Builder',
    description: 'Create 10 habits',
    icon: '⚡',
    requirement: 'Create 10 habits',
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete all daily habits before noon for 7 days',
    icon: '🌅',
    requirement: 'Complete all daily habits early for 7 days',
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Complete all habits for 7 consecutive days',
    icon: '✨',
    requirement: 'Complete all habits for 7 days',
  },
];

// XP rewards
export const XP_REWARDS = {
  COMPLETE_GOAL: 100,
  COMPLETE_HABIT: 10,
  COMPLETE_STEP: 25,
  DAILY_LOGIN: 5,
  UNLOCK_BADGE: 50,
  COMPLETE_CHALLENGE: 100,
};

// Level calculation
export function calculateLevel(xp: number): number {
  // Simple formula: level = sqrt(xp / 100)
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXpForNextLevel(level: number): number {
  return level * level * 100;
}

export function getXpProgress(xp: number, level: number): number {
  const currentLevelXp = (level - 1) * (level - 1) * 100;
  const nextLevelXp = getXpForNextLevel(level);
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

// Check if user has unlocked a badge
export function checkBadgeUnlock(
  userId: string,
  badgeId: BadgeType,
  currentAchievements: UserAchievement[]
): boolean {
  // Check if already unlocked
  if (currentAchievements.some(a => a.badgeId === badgeId)) {
    return false;
  }

  const goals = getGoals(userId);
  const habits = getHabits(userId);

  switch (badgeId) {
    case 'finisher': {
      const completedGoals = goals.filter(g => g.status === 'completed').length;
      return completedGoals >= 5;
    }

    case 'commitment': {
      let maxStreak = 0;
      habits.forEach(habit => {
        const completions = getHabitCompletions(habit.id);
        const { bestStreak } = calculateStreak(completions);
        maxStreak = Math.max(maxStreak, bestStreak);
      });
      return maxStreak >= 30;
    }

    case 'streak_master': {
      let maxStreak = 0;
      habits.forEach(habit => {
        const completions = getHabitCompletions(habit.id);
        const { bestStreak } = calculateStreak(completions);
        maxStreak = Math.max(maxStreak, bestStreak);
      });
      return maxStreak >= 100;
    }

    case 'habit_builder': {
      return habits.length >= 10;
    }

    case 'early_bird':
    case 'consistent': {
      // These would require more complex tracking
      // For now, return false - can be implemented later with time tracking
      return false;
    }

    default:
      return false;
  }
}

// Check all badges and return newly unlocked ones
export function checkAllBadges(
  userId: string,
  currentAchievements: UserAchievement[]
): BadgeType[] {
  const newlyUnlocked: BadgeType[] = [];

  BADGES.forEach(badge => {
    if (checkBadgeUnlock(userId, badge.id, currentAchievements)) {
      newlyUnlocked.push(badge.id);
    }
  });

  return newlyUnlocked;
}

// Active challenges
export const CHALLENGES: Challenge[] = [
  {
    id: 'weekly_warrior',
    title: 'Weekly Warrior',
    description: 'Complete all your habits for 7 consecutive days',
    xpReward: 100,
    requirement: {
      type: 'complete_habits',
      target: 7,
      days: 7,
    },
  },
  {
    id: 'goal_crusher',
    title: 'Goal Crusher',
    description: 'Complete 3 goals this month',
    xpReward: 150,
    requirement: {
      type: 'complete_goals',
      target: 3,
    },
  },
  {
    id: 'streak_builder',
    title: 'Streak Builder',
    description: 'Maintain a 14-day streak on any habit',
    xpReward: 100,
    requirement: {
      type: 'maintain_streak',
      target: 14,
    },
  },
];

// Storage keys
const STORAGE_KEYS = {
  USER_PROGRESS: 'user_progress',
  USER_ACHIEVEMENTS: 'user_achievements',
};

// Get user progress
export function getUserProgress(userId: string): UserProgress {
  if (typeof window === 'undefined') {
    return { userId, xp: 0, level: 1, badges: [] };
  }

  const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  const allProgress: UserProgress[] = data ? JSON.parse(data) : [];
  
  const userProgress = allProgress.find(p => p.userId === userId);
  
  if (!userProgress) {
    return { userId, xp: 0, level: 1, badges: [] };
  }

  return userProgress;
}

// Save user progress
export function saveUserProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;

  const data = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
  const allProgress: UserProgress[] = data ? JSON.parse(data) : [];
  
  const existingIndex = allProgress.findIndex(p => p.userId === progress.userId);
  
  if (existingIndex >= 0) {
    allProgress[existingIndex] = progress;
  } else {
    allProgress.push(progress);
  }

  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(allProgress));
}

// Add XP to user
export function addXp(userId: string, amount: number): { newXp: number; leveledUp: boolean; newLevel: number } {
  const progress = getUserProgress(userId);
  const oldLevel = calculateLevel(progress.xp);
  const newXp = progress.xp + amount;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  progress.xp = newXp;
  progress.level = newLevel;
  saveUserProgress(progress);

  return { newXp, leveledUp, newLevel };
}

// Unlock badge
export function unlockBadge(userId: string, badgeId: BadgeType): UserAchievement {
  const progress = getUserProgress(userId);
  
  const achievement: UserAchievement = {
    id: `${userId}_${badgeId}_${Date.now()}`,
    userId,
    badgeId,
    unlockedAt: new Date().toISOString(),
    seen: false,
  };

  progress.badges.push(achievement);
  saveUserProgress(progress);

  // Award XP for unlocking badge
  addXp(userId, XP_REWARDS.UNLOCK_BADGE);

  return achievement;
}

// Get user achievements
export function getUserAchievements(userId: string): UserAchievement[] {
  const progress = getUserProgress(userId);
  return progress.badges;
}

// Mark achievement as seen
export function markAchievementSeen(userId: string, achievementId: string): void {
  const progress = getUserProgress(userId);
  const achievement = progress.badges.find(a => a.id === achievementId);
  
  if (achievement) {
    achievement.seen = true;
    saveUserProgress(progress);
  }
}
