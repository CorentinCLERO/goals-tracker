import { useState } from 'react';
import type { Goal } from '../types';
import { useGoals } from '../hooks/useGoals';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus } from 'lucide-react';
import { GoalDialog } from './GoalDialog';
import { GoalDetail } from './GoalDetail';
import { GoalCard } from '../components/GoalCard';
import { toast } from 'sonner';

export function Goals() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    goals,
    loading,
    error,
    createGoal,
    updateGoal,
    deleteGoal: deleteGoalApi,
    markGoalAsCompleted: markGoalAsCompletedApi,
  } = useGoals({
    status: filterStatus,
    priority: filterPriority,
    sortBy,
  });

  const handleSaveGoal = async (goal: Goal) => {
    try {
      if (selectedGoal) {
        await updateGoal(goal);
        toast.success('Goal updated successfully!');
      } else {
        await createGoal(goal);
        toast.success('Goal created successfully!');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoalApi(goalId);
      toast.success('Goal deleted successfully!');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const handleMarkComplete = async (goal: Goal) => {
    try {
      await markGoalAsCompletedApi(goal.id);
      toast.success('Goal marked as complete!');
    } catch (error) {
      console.error('Error marking goal as complete:', error);
      toast.error('Failed to mark goal as complete');
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDialogOpen(true);
  };

  const handleViewGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailOpen(true);
  };

  const handleProgressUpdate = () => {
    setRefreshKey(prev => prev + 1);
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
                  <SelectItem value="active">In Progress</SelectItem>
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

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              Loading goals...
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive py-8">
              Error: {error}
            </p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.length === 0 ? (
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
            goals.map(goal => (
              <GoalCard
                key={`${goal.id}-${refreshKey}`}
                goal={goal}
                onView={handleViewGoal}
                onComplete={handleMarkComplete}
              />
            ))
          )}
        </div>
      )}

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
            handleProgressUpdate();
            setIsDetailOpen(false);
          }}
          onProgressUpdate={handleProgressUpdate}
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