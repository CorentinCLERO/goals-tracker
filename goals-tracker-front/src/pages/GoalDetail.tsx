import { useState, useEffect, useCallback } from "react";
import type { Goal, Step } from "../types";
import { apiClient } from "../lib/api";
import { addXp, XP_REWARDS } from "../lib/gamification";
import { useAuth } from "../contexts/auth-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Checkbox } from "../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Plus, Trash2, Edit, Calendar } from "lucide-react";
import { toast } from "sonner";

interface GoalDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
  onUpdate: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

export function GoalDetail({
  open,
  onOpenChange,
  goal,
  onUpdate,
  onDelete,
  onEdit,
}: GoalDetailProps) {
  const { user } = useAuth();
  const [steps, setSteps] = useState<Step[]>([]);
  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDeadline, setNewStepDeadline] = useState("");

  const loadSteps = useCallback(async () => {
    if (!goal) return;
    try {
      const goalSteps = await apiClient.getSteps(goal.id);
      setSteps(goalSteps);
    } catch (error) {
      console.error("Failed to load steps:", error);
    }
  }, [goal]);

  useEffect(() => {
    if (open && goal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSteps();
    }
  }, [open, goal, loadSteps]);

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;

    try {
      // Calculate position based on existing steps
      const maxPosition =
        steps.length > 0 ? Math.max(...steps.map((s) => s.position)) : 0;
      const position = maxPosition + 1;

      const stepData = {
        title: newStepTitle,
        deadline: newStepDeadline ? `${newStepDeadline}T23:59:59` : undefined,
        position,
      };

      await apiClient.createStep(goal.id, stepData);
      await loadSteps();
      setNewStepTitle("");
      setNewStepDeadline("");
      toast.success("Step added!");
      onUpdate();
    } catch (error) {
      console.error("Failed to add step:", error);
      toast.error("Failed to add step");
    }
  };

  const handleToggleStep = async (step: Step) => {
    try {
      if (step.isCompleted) {
        await apiClient.markStepUncompleted(goal.id, step.id);
      } else {
        await apiClient.markStepCompleted(goal.id, step.id);

        // Award XP when completing a step
        if (user) {
          const { leveledUp, newLevel } = addXp(
            user.id,
            XP_REWARDS.COMPLETE_STEP,
          );
          toast.success(`Step completed! +${XP_REWARDS.COMPLETE_STEP} XP`);

          if (leveledUp) {
            toast.success(`🎉 Level Up! You're now level ${newLevel}!`, {
              duration: 5000,
            });
          }
        }
      }

      await loadSteps();
      onUpdate();
    } catch (error) {
      console.error("Failed to toggle step:", error);
      toast.error("Failed to update step");
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    try {
      await apiClient.deleteStep(goal.id, stepId);
      await loadSteps();
      onUpdate();
      toast.success("Step deleted!");
    } catch (error) {
      console.error("Failed to delete step:", error);
      toast.error("Failed to delete step");
    }
  };

  const getProgress = (): number => {
    if (steps.length === 0) return 0;
    const completedSteps = steps.filter((s) => s.isCompleted).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "abandoned":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "abandoned":
        return "Abandoned";
      default:
        return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{goal.title}</DialogTitle>
          <DialogDescription>
            {goal.description || "No description provided"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Goal Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Priority</p>
              <Badge
                className={`${getPriorityColor(goal.priority)} text-white border-0 mt-1`}
              >
                {goal.priority}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant="outline"
                className={`${getStatusColor(goal.status)} mt-1`}
              >
                {formatStatus(goal.status)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <Badge variant="outline" className="mt-1">
                {goal.category}
              </Badge>
            </div>
            {goal.deadline && (
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p className="text-sm mt-1">
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>
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
                  <span>
                    {steps.filter((s) => s.status === "completed").length} of{" "}
                    {steps.length} steps completed
                  </span>
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
                      value={newStepDeadline}
                      onChange={(e) => setNewStepDeadline(e.target.value)}
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
                  steps.map((step) => (
                    <div
                      key={step.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <Checkbox
                        checked={step.isCompleted}
                        onCheckedChange={() => handleToggleStep(step)}
                        id={`step-${step.id}`}
                      />
                      <label
                        htmlFor={`step-${step.id}`}
                        className={`flex-1 cursor-pointer ${
                          step.isCompleted
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {step.title}
                      </label>
                      {step.deadline && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="size-3" />
                          {new Date(step.deadline).toLocaleDateString()}
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
