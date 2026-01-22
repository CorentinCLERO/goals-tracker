import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/auth-context';
import type { Habit, HabitCompletion } from '../types';
import { getHabits, saveHabit, deleteHabit, archiveHabit, getHabitCompletions } from '../lib/storage';
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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showArchived, setShowArchived] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [trackerHabit, setTrackerHabit] = useState<Habit | null>(null);
  const [habitCompletions, setHabitCompletions] = useState<Record<string, HabitCompletion[]>>({});

  const loadHabits = useCallback(async () => {
    if (!user) return;
    const userHabits = await getHabits();
    setHabits(userHabits);

    // Load completions for each habit
    const completionsObj: Record<string, HabitCompletion[]> = {};
    await Promise.all(
      userHabits.map(async (habit) => {
        const completions = await getHabitCompletions(habit.id);
        completionsObj[habit.id] = completions;
      })
    );
    setHabitCompletions(completionsObj);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHabits();
  }, [user, showArchived, loadHabits]);

  const handleSaveHabit = async (habit: Habit) => {
    try {
      const savedHabit = await saveHabit(habit);
      if (savedHabit) {
        await loadHabits();
        setIsDialogOpen(false);
        toast.success(selectedHabit ? 'Habit updated successfully!' : 'Habit created successfully!');
      }
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      await loadHabits();
      toast.success('Habit deleted successfully!');
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleToggleArchive = async (habit: Habit) => {
    try {
      await archiveHabit(habit.id);
      await loadHabits();
      toast.success(habit.isArchived ? 'Habit restored!' : 'Habit archived!');
    } catch (error) {
      console.error('Error archiving habit:', error);
    }
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
          habits
            .filter(h => showArchived || !h.isArchived)
            .map(habit => {
              const completions = habitCompletions[habit.id] || [];
              const { currentStreak, bestStreak } = calculateStreak(completions);
              const completionRate = calculateCompletionRate(completions, habit.startDate);

              return (
                <Card key={habit.id} className={habit.isArchived ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{habit.name}</CardTitle>
                    {habit.isArchived && (
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
                      {habit.frequency === 'DAILY' ? 'Daily' : `${habit.weeklyTarget}x/week`}
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
                      {habit.isArchived ? '↻' : '📦'}
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
