import { useState, useEffect, useCallback } from "react";
import type { Step, StepStatus } from "../types";
import type { ApiStepResponse } from "../types/step.api";
import * as stepApi from "../lib/stepApi";

function mapApiStepToStep(apiStep: ApiStepResponse, goalId: string): Step {
  return {
    id: apiStep.id,
    goalId: goalId,
    title: apiStep.title,
    dueDate: apiStep.deadline || undefined,
    status: apiStep.isCompleted
      ? ("completed" as StepStatus)
      : ("todo" as StepStatus),
    createdAt: apiStep.createdAt,
  };
}

function mapStepToApiRequest(step: Partial<Step>, position: number) {
  const formatToDateTime = (dateString: string | undefined) => {
    if (!dateString) return new Date().toISOString().slice(0, 19);

    if (dateString.includes("T")) {
      return dateString.slice(0, 19);
    }

    return `${dateString}T00:00:00`;
  };

  return {
    title: step.title || "",
    deadline: formatToDateTime(step.dueDate),
    position: position,
    isCompleted: step.status === "completed",
    completedAt:
      step.status === "completed"
        ? new Date().toISOString().slice(0, 19)
        : undefined,
  };
}

export function useSteps(goalId: string) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSteps = useCallback(async () => {
    if (!goalId) return;

    try {
      setLoading(true);
      setError(null);
      const apiSteps = await stepApi.getSteps(goalId);
      const mappedSteps = (apiSteps || []).map((apiStep) =>
        mapApiStepToStep(apiStep, goalId),
      );
      setSteps(mappedSteps);
    } catch (err) {
      console.error("Error loading steps:", err);
      setError(err instanceof Error ? err.message : "Failed to load steps");
    } finally {
      setLoading(false);
    }
  }, [goalId]);

  const createStep = useCallback(
    async (step: Omit<Step, "id" | "createdAt">): Promise<void> => {
      try {
        const position = steps.length + 1;
        const apiRequest = mapStepToApiRequest(step, position);

        await stepApi.createStep(goalId, apiRequest);
        await loadSteps();
      } catch (err) {
        console.error("Error creating step:", err);
        throw err;
      }
    },
    [goalId, steps.length, loadSteps],
  );

  const updateStep = useCallback(
    async (
      stepId: string,
      updates: { title?: string; dueDate?: string },
    ): Promise<void> => {
      try {
        const formatToDateTime = (dateString: string | undefined) => {
          if (!dateString) return undefined;

          if (dateString.includes("T")) {
            return dateString.slice(0, 19);
          }

          return `${dateString}T00:00:00`;
        };

        const updateRequest = {
          title: updates.title,
          deadline: updates.dueDate
            ? formatToDateTime(updates.dueDate)
            : undefined,
        };

        await stepApi.updateStep(goalId, stepId, updateRequest);
        await loadSteps();
      } catch (err) {
        console.error("Error updating step:", err);
        throw err;
      }
    },
    [goalId, loadSteps],
  );

  const toggleStepCompletion = useCallback(
    async (stepId: string, isCompleted: boolean): Promise<void> => {
      try {
        if (isCompleted) {
          await stepApi.completeStep(goalId, stepId);
        } else {
          await stepApi.uncompleteStep(goalId, stepId);
        }
        await loadSteps();
      } catch (err) {
        console.error("Error toggling step completion:", err);
        throw err;
      }
    },
    [goalId, loadSteps],
  );

  const deleteStep = useCallback(
    async (stepId: string): Promise<void> => {
      try {
        await stepApi.deleteStep(goalId, stepId);
        await loadSteps();
      } catch (err) {
        console.error("Error deleting step:", err);
        throw err;
      }
    },
    [goalId, loadSteps],
  );

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  return {
    steps,
    loading,
    error,
    refetch: loadSteps,
    createStep,
    updateStep,
    toggleStepCompletion,
    deleteStep,
  };
}
