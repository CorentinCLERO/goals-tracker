import { useStats } from '../hooks/useStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  TrendingUp, 
  Loader2,
  Award,
  Zap,
  BarChart3
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function Stats() {
  const { globalStats, goalsByCategory, habitStats, loading, error } = useStats();

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

  if (!globalStats) {
    return <div>Aucune donnée disponible</div>;
  }

  const categoryData = goalsByCategory ? Object.entries(goalsByCategory).map(([name, value]) => ({
    name,
    value,
  })) : [];

  const habitChartData = habitStats?.slice(0, 8).map(habit => ({
    name: habit.habitName.length > 15 ? habit.habitName.substring(0, 15) + '...' : habit.habitName,
    completionRate: habit.completionRate,
    currentStreak: habit.currentStreak,
    longestStreak: habit.longestStreak,
  })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl mb-2">Statistiques</h2>
        <p className="text-muted-foreground">
          Analysez vos performances et votre progression détaillée.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-blue-800">Objectifs Complétés</CardTitle>
            <Trophy className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{globalStats.totalGoalsCompleted}</div>
            <p className="text-xs text-blue-700">objectifs terminés</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-green-800">Total Logs Habitudes</CardTitle>
            <Target className="size-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{globalStats.totalHabitLogs}</div>
            <p className="text-xs text-green-700">actions complétées</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-orange-800">Plus Long Streak</CardTitle>
            <Flame className="size-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{globalStats.longestStreakRecord}</div>
            <p className="text-xs text-orange-700">jours consécutifs</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-purple-800">XP Total</CardTitle>
            <Zap className="size-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{globalStats.totalXP}</div>
            <p className="text-xs text-purple-700">points d'expérience</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Objectifs par Catégorie
              </CardTitle>
              <CardDescription>
                Répartition de vos objectifs par domaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {habitChartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Performance des Habitudes
              </CardTitle>
              <CardDescription>
                Taux de réussite de vos habitudes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={habitChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}${name === 'completionRate' ? '%' : ''}`, 
                      name === 'completionRate' ? 'Taux de réussite' : 'Streak'
                    ]}
                  />
                  <Bar dataKey="completionRate" fill="#8884d8" name="completionRate" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {habitStats && habitStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5" />
              Statistiques Détaillées des Habitudes
            </CardTitle>
            <CardDescription>
              Vue d'ensemble de toutes vos habitudes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {habitStats.map((habit, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-lg">{habit.habitName}</h4>
                    <Badge 
                      variant={habit.completionRate >= 80 ? "default" : habit.completionRate >= 60 ? "secondary" : "destructive"}
                      className="ml-2"
                    >
                      {habit.completionRate.toFixed(1)}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
                        <Flame className="size-4" />
                        <span className="font-medium">{habit.currentStreak}</span>
                      </div>
                      <p className="text-muted-foreground">Streak Actuel</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                        <Flame className="size-4" />
                        <span className="font-medium">{habit.longestStreak}</span>
                      </div>
                      <p className="text-muted-foreground">Record</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                        <Target className="size-4" />
                        <span className="font-medium">{habit.totalCompleted}</span>
                      </div>
                      <p className="text-muted-foreground">Total Réalisé</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                        <Star className="size-4" />
                        <span className="font-medium">{(habit.totalCompleted * 5).toFixed(0)}</span>
                      </div>
                      <p className="text-muted-foreground">XP Gagné</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de réussite</span>
                      <span>{habit.completionRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={habit.completionRate} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {habitStats && habitStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="size-5" />
              Comparaison des Streaks
            </CardTitle>
            <CardDescription>
              Streak actuel vs record pour chaque habitude
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={habitChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="currentStreak" fill="#f97316" name="Streak Actuel" />
                <Bar dataKey="longestStreak" fill="#dc2626" name="Record" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}