import { useState } from 'react';
import type React from 'react';
import { useAuth } from '../contexts/auth-context';
import type { Habit, Frequency } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';

interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit | null;
  onSave: (habit: Habit) => void;
}

const getDefaultStartDate = () => new Date().toISOString().split('T')[0];

export function HabitDialog({ open, onOpenChange, habit, onSave }: HabitDialogProps) {
  const { user } = useAuth();
  
  // Initialize form state from habit prop - key prop on form will reset when habit.id changes
  const [name, setName] = useState(() => habit?.name || '');
  const [description, setDescription] = useState(() => habit?.description || '');
  const [frequency, setFrequency] = useState<Frequency>(() => habit?.frequency || 'daily');
  const [weeklyTarget, setWeeklyTarget] = useState(() => habit?.weeklyTarget || 3);
  const [category, setCategory] = useState(() => habit?.category || 'Health');
  const [startDate, setStartDate] = useState(() => habit?.startDate || getDefaultStartDate());

  const resetForm = () => {
    setName('');
    setDescription('');
    setFrequency('daily');
    setWeeklyTarget(3);
    setCategory('Health');
    setStartDate(getDefaultStartDate());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const habitData: Habit = {
      id: habit?.id || crypto.randomUUID(),
      userId: user.id,
      name,
      description: description || undefined,
      frequency,
      weeklyTarget: frequency === 'weekly' ? weeklyTarget : undefined,
      category,
      startDate,
      archived: habit?.archived || false,
      createdAt: habit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(habitData);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          <DialogDescription>
            {habit ? 'Update your habit details' : 'Define a new habit to build'}
          </DialogDescription>
        </DialogHeader>
        <form key={habit?.id || 'new'} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning meditation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your habit..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <Label>Frequency *</Label>
            <RadioGroup value={frequency} onValueChange={(value) => setFrequency(value as Frequency)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="cursor-pointer">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="cursor-pointer">Weekly</Label>
              </div>
            </RadioGroup>
          </div>

          {frequency === 'weekly' && (
            <div className="space-y-2">
              <Label htmlFor="weeklyTarget">Times per week *</Label>
              <Input
                id="weeklyTarget"
                type="number"
                min="1"
                max="7"
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(parseInt(e.target.value))}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Fitness">Fitness</SelectItem>
                  <SelectItem value="Mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="Productivity">Productivity</SelectItem>
                  <SelectItem value="Learning">Learning</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {habit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
