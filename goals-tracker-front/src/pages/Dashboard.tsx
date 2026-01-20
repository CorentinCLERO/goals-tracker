import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import type { Goal, Habit, Stats } from '../types';
import { getGoals, getHabits, getSteps, getHabitCompletions } from '../lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Target, CheckCircle2, Flame, TrendingUp } from 'lucide-react';
import { calculateStreak, formatDate } from '../lib/utils-habit';

export function Dashboard() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<Stats>({
    completedGoals: 0,
    longestStreak: 0,
    habitsCompletedToday: 0,
    activeGoals: 0,
    activeHabits: 0,
  });

  const loadData = () => {
    if (!user) return;

    const userGoals = getGoals(user.id);
    const userHabits = getHabits(user.id).filter(h => !h.archived);
    
    setGoals(userGoals);
    setHabits(userHabits);

    // Calculate stats
    const completedGoals = userGoals.filter(g => g.status === 'completed').length;
    const activeGoals = userGoals.filter(g => g.status === 'in_progress').length;
    
    let longestStreak = 0;
    let habitsCompletedToday = 0;
    const today = formatDate(new Date());

    userHabits.forEach(habit => {
      const completions = getHabitCompletions(habit.id);
      const { bestStreak } = calculateStreak(completions);
      longestStreak = Math.max(longestStreak, bestStreak);
      
      if (completions.some(c => c.date === today)) {
        habitsCompletedToday++;
      }
    });

    setStats({
      completedGoals,
      longestStreak,
      habitsCompletedToday,
      activeGoals,
      activeHabits: userHabits.length,
    });
  };

  useEffect(() => {
    if (!user) return;
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getGoalProgress = (goal: Goal): number => {
    const steps = getSteps(goal.id);
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const ongoingGoals = goals.filter(g => g.status === 'in_progress').slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your progress overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Goals</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedGoals} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Habits</CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeHabits}</div>
            <p className="text-xs text-muted-foreground">
              {stats.habitsCompletedToday} completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Longest Streak</CardTitle>
            <Flame className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.longestStreak}</div>
            <p className="text-xs text-muted-foreground">
              days in a row
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completion Rate</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {stats.activeHabits > 0 
                ? Math.round((stats.habitsCompletedToday / stats.activeHabits) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              habits today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ongoing Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Ongoing Goals</CardTitle>
          <CardDescription>
            Your active goals and their progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ongoingGoals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active goals. Create one to get started!
            </p>
          ) : (
            <div className="space-y-4">
              {ongoingGoals.map(goal => {
                const progress = getGoalProgress(goal);
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-white border-0`}>
                            {goal.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{goal.category}</p>
                      </div>
                      <span className="text-sm">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
          <CardDescription>
            Track your daily habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No habits yet. Create one to build your routine!
            </p>
          ) : (
            <div className="space-y-3">
              {habits.slice(0, 5).map(habit => {
                const completions = getHabitCompletions(habit.id);
                const today = formatDate(new Date());
                const isCompletedToday = completions.some(c => c.date === today);
                const { currentStreak } = calculateStreak(completions);

                return (
                  <div key={habit.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center ${
                        isCompletedToday ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <CheckCircle2 className={`size-5 ${
                          isCompletedToday ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{habit.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {habit.frequency === 'daily' ? 'Daily' : `${habit.weeklyTarget}x per week`}
                        </p>
                      </div>
                    </div>
                    {currentStreak > 0 && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Flame className="size-4" />
                        <span className="text-sm">{currentStreak}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
