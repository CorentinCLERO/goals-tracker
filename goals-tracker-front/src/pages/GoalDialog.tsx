import React, { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import type { Goal, Priority, GoalStatus } from '../types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal | null;
  onSave: (goal: Goal) => void;
}

const getDefaultStartDate = () => new Date().toISOString().split('T')[0];

export function GoalDialog({ open, onOpenChange, goal, onSave }: GoalDialogProps) {
  const { user } = useAuth();
  
  // Initialize form state from goal prop - key prop on Dialog will reset when goal.id changes
  const [title, setTitle] = useState(() => goal?.title || '');
  const [description, setDescription] = useState(() => goal?.description || '');
  const [startDate, setStartDate] = useState(() => goal?.startDate || getDefaultStartDate());
  const [dueDate, setDueDate] = useState(() => goal?.dueDate || '');
  const [priority, setPriority] = useState<Priority>(() => goal?.priority || 'medium');
  const [status, setStatus] = useState<GoalStatus>(() => goal?.status || 'in_progress');
  const [category, setCategory] = useState(() => goal?.category || 'Personal');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate(getDefaultStartDate());
    setDueDate('');
    setPriority('medium');
    setStatus('in_progress');
    setCategory('Personal');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const goalData: Goal = {
      id: goal?.id || crypto.randomUUID(),
      userId: user.id,
      title,
      description: description || undefined,
      startDate,
      dueDate: dueDate || undefined,
      priority,
      status,
      category,
      createdAt: goal?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(goalData);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          <DialogDescription>
            {goal ? 'Update your goal details' : 'Define a new goal to work towards'}
          </DialogDescription>
        </DialogHeader>
        <form key={goal?.id || 'new'} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Learn a new language"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal in detail..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as GoalStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Career">Career</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Relationships">Relationships</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {goal ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
