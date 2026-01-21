import type { HabitCompletion } from '../types';

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function calculateStreak(completions: HabitCompletion[]): {
  currentStreak: number;
  bestStreak: number;
} {
  if (completions.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Sort completions by date (newest first)
  const sortedDates = completions
    .map(c => c.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Remove duplicates
  const uniqueDates = Array.from(new Set(sortedDates));

  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(Date.now() - 86400000));

  // Calculate current streak
  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    let checkDate = new Date();
    if (!uniqueDates.includes(today)) {
      checkDate = new Date(Date.now() - 86400000);
    }

    while (uniqueDates.includes(formatDate(checkDate))) {
      currentStreak++;
      checkDate = new Date(checkDate.getTime() - 86400000);
    }
  }

  // Calculate best streak
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const current = new Date(uniqueDates[i]);
      const previous = new Date(uniqueDates[i - 1]);
      const diffDays = Math.floor(
        (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  bestStreak = Math.max(bestStreak, tempStreak);

  return { currentStreak, bestStreak };
}

export function calculateCompletionRate(
  completions: HabitCompletion[],
  startDate: string,
  days: number = 30
): number {
  const endDate = new Date();
  const start = new Date(startDate);
  const actualStart = start > endDate ? endDate : start;
  
  const daysSinceStart = Math.min(
    days,
    Math.floor((endDate.getTime() - actualStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );

  if (daysSinceStart <= 0) return 0;

  const completedDays = completions.filter(c => {
    const compDate = new Date(c.date);
    return compDate >= actualStart && compDate <= endDate;
  }).length;

  return Math.round((completedDays / daysSinceStart) * 100);
}

export function getWeekDates(date: Date = new Date()): Date[] {
  const week: Date[] = [];
  const current = new Date(date);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday

  current.setDate(diff);

  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return week;
}

export function getMonthDates(date: Date = new Date()): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const dates: Date[] = [];
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }
  
  return dates;
}
