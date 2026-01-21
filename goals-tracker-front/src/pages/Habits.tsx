import { useState, useMemo, useReducer } from 'react';
import { useAuth } from '../contexts/auth-context';
import type { Habit } from '../types';
import { getHabits, saveHabit, deleteHabit, getHabitCompletions } from '../lib/storage';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Plus, Flame, TrendingUp, Edit, Trash2, Calendar } from 'lucide-react';
import { HabitDialog } from './HabitDialog';
import { HabitTracker } from './HabitTracker';
import { calculateStreak, calculateCompletionRate } from '../lib/utils-habit';
import { toast } from 'sonner';

export function Habits() {
  const { user } = useAuth();
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [trackerHabit, setTrackerHabit] = useState<Habit | null>(null);
  const [habitsVersion, incrementHabitsVersion] = useReducer((x: number) => x + 1, 0);

  // Derive habits from storage - recalculated when user, showArchived, or version changes
  const habits = useMemo(() => {
    if (!user) return [];
    return getHabits(user.id).filter(h => showArchived || !h.archived);
  }, [user, showArchived, habitsVersion]);

  const loadHabits = () => {
    incrementHabitsVersion();
  };

  const handleSaveHabit = (habit: Habit) => {
    saveHabit(habit);
    loadHabits();
    setIsDialogOpen(false);
    toast.success(selectedHabit ? 'Habit updated successfully!' : 'Habit created successfully!');
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
    loadHabits();
    toast.success('Habit deleted successfully!');
  };

  const handleToggleArchive = (habit: Habit) => {
    const updatedHabit = { ...habit, archived: !habit.archived, updatedAt: new Date().toISOString() };
    saveHabit(updatedHabit);
    loadHabits();
    toast.success(habit.archived ? 'Habit restored!' : 'Habit archived!');
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsDialogOpen(true);
  };

  const handleOpenTracker = (habit: Habit) => {
    setTrackerHabit(habit);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Habits</h2>
          <p className="text-muted-foreground">
            Build and track your daily and weekly habits
          </p>
        </div>
        <Button onClick={() => {
          setSelectedHabit(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="size-4 mr-2" />
          New Habit
        </Button>
      </div>

      {/* Show Archived Toggle */}
      <div className="flex items-center gap-2">
        <Switch
          id="show-archived"
          checked={showArchived}
          onCheckedChange={setShowArchived}
        />
        <label htmlFor="show-archived" className="text-sm cursor-pointer">
          Show archived habits
        </label>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  {showArchived 
                    ? 'No archived habits found.'
                    : 'No active habits found. Create your first habit to get started!'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          habits.map(habit => {
            const completions = getHabitCompletions(habit.id);
            const { currentStreak, bestStreak } = calculateStreak(completions);
            const completionRate = calculateCompletionRate(completions, habit.startDate);

            return (
              <Card key={habit.id} className={habit.archived ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{habit.name}</CardTitle>
                    {habit.archived && (
                      <Badge variant="outline" className="shrink-0">Archived</Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {habit.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{habit.category}</Badge>
                    <Badge variant="outline">
                      {habit.frequency === 'daily' ? 'Daily' : `${habit.weeklyTarget}x/week`}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-orange-600">
                        <Flame className="size-4" />
                        <span className="text-xl">{currentStreak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Current</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-blue-600">
                        <Flame className="size-4" />
                        <span className="text-xl">{bestStreak}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Best</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1 text-green-600">
                        <TrendingUp className="size-4" />
                        <span className="text-xl">{completionRate}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Rate</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenTracker(habit)}
                      className="flex-1"
                    >
                      <Calendar className="size-4 mr-2" />
                      Track
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditHabit(habit)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleArchive(habit)}
                    >
                      {habit.archived ? '↻' : '📦'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteHabit(habit.id)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <HabitDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        habit={selectedHabit}
        onSave={handleSaveHabit}
      />

      {trackerHabit && (
        <HabitTracker
          open={!!trackerHabit}
          onOpenChange={(open) => !open && setTrackerHabit(null)}
          habit={trackerHabit}
        />
      )}
    </div>
  );
}
