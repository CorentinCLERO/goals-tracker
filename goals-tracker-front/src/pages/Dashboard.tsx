import { useAuth } from '../contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Target, CheckCircle2, Flame, TrendingUp, Star, Trophy, Loader2 } from 'lucide-react';
import { useGamification } from '../hooks/useGamification';
import { useDashboard } from '../hooks/useDashboard';

export function Dashboard() {
  const { user } = useAuth();
  const { userProgress, loading: gamificationLoading } = useGamification(user?.id || "");
  const { dashboardData, loading: dashboardLoading, error } = useDashboard();

  const loading = gamificationLoading || dashboardLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  const { stats, habitsToday, recentGoals } = dashboardData;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Calculate progress percentage for next level
  const currentLevelXp = userProgress.level === 1 ? 0 : 
    userProgress.level === 2 ? 100 :
    userProgress.level === 3 ? 300 :
    userProgress.level === 4 ? 600 : 1000;
  
  const nextLevelXp = userProgress.level === 1 ? 100 :
    userProgress.level === 2 ? 300 :
    userProgress.level === 3 ? 600 :
    userProgress.level === 4 ? 1000 : 1000;

  const progressPercent = nextLevelXp === currentLevelXp ? 100 : 
    ((userProgress.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}! Here's your progress overview.
        </p>
      </div>

      {/* Level & XP Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-full">
                <Star className="size-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">Level {userProgress.level}</span>
                  <Badge variant="secondary" className="bg-yellow-500 text-white">
                    <Trophy className="size-3 mr-1" />
                    {userProgress.badges.length} Badges
                  </Badge>
                </CardTitle>
                <CardDescription className="text-indigo-700">
                  {userProgress.xp} XP • {nextLevelXp - userProgress.xp} XP to next level
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{userProgress.xp}</div>
              <div className="text-sm text-muted-foreground">Total XP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Goals</CardTitle>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeGoalsCount}</div>
            <p className="text-xs text-muted-foreground">
              goals in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Today's Habits</CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalHabitsToday}</div>
            <p className="text-xs text-muted-foreground">
              {stats.habitsCompletedTodayCount} completed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Global Streak</CardTitle>
            <Flame className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.currentGlobalStreak}</div>
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
              {stats.totalHabitsToday > 0 
                ? Math.round((stats.habitsCompletedTodayCount / stats.totalHabitsToday) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              habits today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Goals */}
      {recentGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Goals</CardTitle>
            <CardDescription>
              Your recent goals and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGoals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-white border-0`}>
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-sm">{goal.progressPercentage}%</span>
                  </div>
                  <Progress value={goal.progressPercentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Today's Habits */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Habits</CardTitle>
          <CardDescription>
            Track your daily habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {habitsToday.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No habits yet. Create one to build your routine!
            </p>
          ) : (
            <div className="space-y-3">
              {habitsToday.map((habit, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full flex items-center justify-center ${
                      habit.completedToday ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <CheckCircle2 className={`size-5 ${
                        habit.completedToday ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium">{habit.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {habit.completedToday ? 'Completed today' : 'Not completed yet'}
                      </p>
                    </div>
                  </div>
                  {habit.currentStreak > 0 && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <Flame className="size-4" />
                      <span className="text-sm">{habit.currentStreak}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}