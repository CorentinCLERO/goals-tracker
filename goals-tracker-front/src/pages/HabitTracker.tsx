import { useState, useMemo, useReducer } from 'react';
import type { Habit, HabitCompletion } from '../types';
import { getHabitCompletions, saveHabitCompletion, deleteHabitCompletion } from '../lib/storage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Circle, ChevronLeft, ChevronRight, Flame, TrendingUp } from 'lucide-react';
import { formatDate, calculateStreak, calculateCompletionRate, getMonthDates } from '../lib/utils-habit';
import { toast } from 'sonner';

interface HabitTrackerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
}

export function HabitTracker({ open, onOpenChange, habit }: HabitTrackerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [completionsVersion, incrementCompletionsVersion] = useReducer((x: number) => x + 1, 0);

  // Derive completions from storage - recalculated when habit, open, or version changes
  const completions = useMemo(() => {
    if (!open || !habit) return [];
    return getHabitCompletions(habit.id);
  }, [open, habit, completionsVersion]);

  const loadCompletions = () => {
    incrementCompletionsVersion();
  };

  const handleToggleDay = (date: Date) => {
    const dateStr = formatDate(date);
    const isCompleted = completions.some(c => c.date === dateStr);

    if (isCompleted) {
      deleteHabitCompletion(habit.id, dateStr);
      toast.success('Day unmarked!');
    } else {
      const completion: HabitCompletion = {
        id: crypto.randomUUID(),
        habitId: habit.id,
        date: dateStr,
        createdAt: new Date().toISOString(),
      };
      saveHabitCompletion(completion);
      toast.success('Day completed! 🎉');
    }
    loadCompletions();
  };

  const handleQuickCheck = () => {
    const today = new Date();
    handleToggleDay(today);
  };

  const isDateCompleted = (date: Date): boolean => {
    const dateStr = formatDate(date);
    return completions.some(c => c.date === dateStr);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthDates = getMonthDates(currentMonth);
  const firstDayOfWeek = monthDates[0].getDay();
  const paddingDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const { currentStreak, bestStreak } = calculateStreak(completions);
  const completionRate = calculateCompletionRate(completions, habit.startDate);
  const today = formatDate(new Date());
  const isCompletedToday = completions.some(c => c.date === today);

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{habit.name}</DialogTitle>
          <DialogDescription>
            Track your progress and build your streak
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Check Button */}
          <Card className={isCompletedToday ? 'bg-green-50 border-green-200' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Today's Progress</h4>
                  <p className="text-sm text-muted-foreground">
                    {isCompletedToday ? 'Completed! Great job! 🎉' : 'Mark today as completed'}
                  </p>
                </div>
                <Button
                  size="lg"
                  variant={isCompletedToday ? 'outline' : 'default'}
                  onClick={handleQuickCheck}
                  className={isCompletedToday ? 'border-green-500 text-green-700' : ''}
                >
                  {isCompletedToday ? (
                    <>
                      <CheckCircle2 className="size-5 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="size-5 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Flame className="size-6 text-orange-500" />
                  <span className="text-3xl">{currentStreak}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Best Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Flame className="size-6 text-blue-500" />
                  <span className="text-3xl">{bestStreak}</span>
                  <span className="text-muted-foreground">days</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-6 text-green-500" />
                  <span className="text-3xl">{completionRate}%</span>
                  <span className="text-muted-foreground">30d</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{monthName}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={goToNextMonth}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Week day headers */}
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                
                {/* Padding days */}
                {Array.from({ length: paddingDays }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                
                {/* Calendar days */}
                {monthDates.map(date => {
                  const isCompleted = isDateCompleted(date);
                  const isToday = formatDate(date) === today;
                  const isFuture = date > new Date();

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => !isFuture && handleToggleDay(date)}
                      disabled={isFuture}
                      className={`
                        aspect-square p-2 rounded-lg border-2 transition-all
                        ${isCompleted 
                          ? 'bg-green-500 border-green-600 text-white hover:bg-green-600' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                        ${isToday && !isCompleted ? 'border-blue-500 ring-2 ring-blue-200' : ''}
                        ${isFuture ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-sm">{date.getDate()}</span>
                        {isCompleted && (
                          <CheckCircle2 className="size-4 mt-1" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Habit Info */}
          <div className="flex gap-2">
            <Badge variant="outline">{habit.category}</Badge>
            <Badge variant="outline">
              {habit.frequency === 'daily' ? 'Daily' : `${habit.weeklyTarget}x per week`}
            </Badge>
            <Badge variant="outline">
              Started {new Date(habit.startDate).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
