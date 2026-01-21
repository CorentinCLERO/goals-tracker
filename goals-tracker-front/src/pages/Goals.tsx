import React, { useState, useMemo, useReducer } from 'react';
import { useAuth } from '../contexts/auth-context';
import type { Goal, Priority, GoalStatus } from '../types';
import { getGoals, saveGoal, deleteGoal, getSteps } from '../lib/storage';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Calendar, Eye } from 'lucide-react';
import { GoalDialog } from './GoalDialog';
import { GoalDetail } from './GoalDetail';
import { toast } from 'sonner';

export function Goals() {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [goalsVersion, incrementGoalsVersion] = useReducer((x: number) => x + 1, 0);

  // Derive goals from storage - recalculated when user or version changes
  const goals = useMemo(() => {
    if (!user) return [];
    return getGoals(user.id);
  }, [user, goalsVersion]);

  const loadGoals = () => {
    incrementGoalsVersion();
  };

  // Derive filtered and sorted goals using useMemo instead of useEffect
  const filteredGoals = useMemo(() => {
    let filtered = [...goals];

    // Apply filters
    if (filterStatus !== 'all') {
      filtered = filtered.filter(g => g.status === filterStatus);
    }
    if (filterPriority !== 'all') {
      filtered = filtered.filter(g => g.priority === filterPriority);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return filtered;
  }, [goals, filterStatus, filterPriority, sortBy]);

  const handleSaveGoal = (goal: Goal) => {
    saveGoal(goal);
    loadGoals();
    setIsDialogOpen(false);
    toast.success(selectedGoal ? 'Goal updated successfully!' : 'Goal created successfully!');
  };

  const handleDeleteGoal = (goalId: string) => {
    deleteGoal(goalId);
    loadGoals();
    toast.success('Goal deleted successfully!');
  };

  const handleMarkComplete = (goal: Goal) => {
    const updatedGoal = { ...goal, status: 'completed' as GoalStatus, updatedAt: new Date().toISOString() };
    saveGoal(updatedGoal);
    loadGoals();
    toast.success('Goal marked as completed! 🎉');
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const handleViewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  };

  const getGoalProgress = (goal: Goal): number => {
    const steps = getSteps(goal.id);
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter(s => s.status === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
    }
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'abandoned': return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status: GoalStatus) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'abandoned': return 'Abandoned';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl mb-2">Goals</h2>
          <p className="text-muted-foreground">
            Manage and track your personal and professional goals
          </p>
        </div>
        <Button onClick={() => {
          setSelectedGoal(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="size-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="abandoned">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Priority</label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dueDate">Due Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground py-8">
                  No goals found. Create your first goal to get started!
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredGoals.map(goal => {
            const progress = getGoalProgress(goal);
            return (
              <Card key={goal.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{goal.title}</CardTitle>
                    <Badge variant="outline" className={`${getPriorityColor(goal.priority)} text-white border-0 shrink-0`}>
                      {goal.priority}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {goal.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className={getStatusColor(goal.status)}>
                        {formatStatus(goal.status)}
                      </Badge>
                      <Badge variant="outline">{goal.category}</Badge>
                    </div>

                    {goal.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="size-4" />
                        <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewGoal(goal)}
                      className="flex-1"
                    >
                      <Eye className="size-4 mr-2" />
                      View
                    </Button>
                    {goal.status === 'in_progress' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMarkComplete(goal)}
                        className="flex-1"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        goal={selectedGoal}
        onSave={handleSaveGoal}
      />

      {selectedGoal && (
        <GoalDetail
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          goal={selectedGoal}
          onUpdate={() => {
            loadGoals();
            setIsDetailOpen(false);
          }}
          onDelete={() => {
            handleDeleteGoal(selectedGoal.id);
            setIsDetailOpen(false);
          }}
          onEdit={() => {
            setIsDetailOpen(false);
            handleEditGoal(selectedGoal);
          }}
        />
      )}
    </div>
  );
}
