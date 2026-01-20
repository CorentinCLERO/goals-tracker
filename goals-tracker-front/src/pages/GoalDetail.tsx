import React, { useState, useEffect } from 'react';
import type { Goal, Step, StepStatus } from '../types';
import { getSteps, saveStep, deleteStep } from '../lib/storage';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Trash2, Edit, Calendar, Flag } from 'lucide-react';
import { toast } from 'sonner';

interface GoalDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function GoalDetail({ open, onOpenChange, goal, onUpdate, onDelete, onEdit }: GoalDetailProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDueDate, setNewStepDueDate] = useState('');

  useEffect(() => {
    if (open && goal) {
      loadSteps();
    }
  }, [open, goal]);

  const loadSteps = () => {
    const goalSteps = getSteps(goal.id);
    setSteps(goalSteps);
  };

  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;

    const newStep: Step = {
      id: crypto.randomUUID(),
      goalId: goal.id,
      title: newStepTitle,
      dueDate: newStepDueDate || undefined,
      status: 'todo',
      createdAt: new Date().toISOString(),
    };

    saveStep(newStep);
    loadSteps();
    setNewStepTitle('');
    setNewStepDueDate('');
    toast.success('Step added!');
  };

  const handleToggleStep = (step: Step) => {
    const updatedStep: Step = {
      ...step,
      status: step.status === 'completed' ? 'todo' : 'completed',
    };
    saveStep(updatedStep);
    loadSteps();
    onUpdate();
  };

  const handleDeleteStep = (stepId: string) => {
    deleteStep(stepId);
    loadSteps();
    onUpdate();
    toast.success('Step deleted!');
  };

  const getProgress = (): number => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'abandoned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'abandoned': return 'Abandoned';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{goal.title}</DialogTitle>
          <DialogDescription>
            {goal.description || 'No description provided'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Goal Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <Badge className={`${getPriorityColor(goal.priority)} text-white border-0 mt-1`}>
                {goal.priority}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="outline" className={`${getStatusColor(goal.status)} mt-1`}>
                {formatStatus(goal.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline" className="mt-1">{goal.category}</Badge>
            </div>
            {goal.dueDate && (
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-sm mt-1">{new Date(goal.dueDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{steps.filter(s => s.status === 'completed').length} of {steps.length} steps completed</span>
                  <span>{getProgress()}%</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Step Form */}
              <form onSubmit={handleAddStep} className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="step-title">New Step</Label>
                    <Input
                      id="step-title"
                      value={newStepTitle}
                      onChange={(e) => setNewStepTitle(e.target.value)}
                      placeholder="Enter step title..."
                    />
                  </div>
                  <div className="w-40 space-y-2">
                    <Label htmlFor="step-date">Due Date</Label>
                    <Input
                      id="step-date"
                      type="date"
                      value={newStepDueDate}
                      onChange={(e) => setNewStepDueDate(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" size="sm" className="w-full">
                  <Plus className="size-4 mr-2" />
                  Add Step
                </Button>
              </form>

              {/* Steps List */}
              <div className="space-y-2">
                {steps.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No steps yet. Add steps to break down your goal.
                  </p>
                ) : (
                  steps.map(step => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={step.status === 'completed'}
                        onCheckedChange={() => handleToggleStep(step)}
                        id={`step-${step.id}`}
                      />
                      <label
                        htmlFor={`step-${step.id}`}
                        className={`flex-1 cursor-pointer ${
                          step.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {step.title}
                      </label>
                      {step.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          {new Date(step.dueDate).toLocaleDateString()}
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteStep(step.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="size-4 mr-2" />
              Edit Goal
            </Button>
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4 mr-2" />
              Delete Goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
