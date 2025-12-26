import { useState, useCallback } from 'react';
import type { TestStep, ExpectedResult } from '@/types';
import { sortBy } from '@/utils';

export interface UseStepsManagementReturn {
  steps: TestStep[];
  selectedStepId: number | null;
  selectedExpectedResultId: { stepId: number; resultId: number } | null;
  editingStepId: number | null;
  setSelectedStepId: (id: number | null) => void;
  setSelectedExpectedResultId: (
    selection: { stepId: number; resultId: number } | null
  ) => void;
  setEditingStepId: (id: number | null) => void;
  addStepAfter: (afterStepId: number) => void;
  deleteStep: (id: number) => void;
  addExpectedResult: (stepId: number, afterResultId?: number) => void;
  deleteExpectedResult: (stepId: number, resultId: number) => void;
  updateStepDescription: (stepId: number, newDescription: string) => void;
  updateExpectedResultDescription: (
    stepId: number,
    resultId: number,
    newDescription: string
  ) => void;
}

/**
 * Custom hook for managing test steps
 *
 * Handles all state and operations related to test steps including:
 * - Adding/deleting steps
 * - Adding/deleting expected results
 * - Updating descriptions
 * - Managing selection and editing states
 *
 * @param initialSteps - Initial array of test steps
 * @returns Object containing steps state and management functions
 *
 * @example
 * ```tsx
 * const {
 *   steps,
 *   addStepAfter,
 *   deleteStep,
 *   updateStepDescription
 * } = useStepsManagement(initialSteps);
 * ```
 */
export const useStepsManagement = (
  initialSteps: TestStep[]
): UseStepsManagementReturn => {
  const [steps, setSteps] = useState<TestStep[]>(initialSteps);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [selectedExpectedResultId, setSelectedExpectedResultId] = useState<{
    stepId: number;
    resultId: number;
  } | null>(null);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);

  /**
   * Add a new step after the specified step
   */
  const addStepAfter = useCallback((afterStepId: number) => {
    setSteps((prevSteps) => {
      const afterIndex = prevSteps.findIndex((step) => step.id === afterStepId);
      if (afterIndex === -1) return prevSteps;

      // Generate new ID using sortBy utility
      const sortedSteps = sortBy(prevSteps, 'id', 'desc');
      const maxId = sortedSteps[0]?.id || 0;

      const newStep: TestStep = {
        id: maxId + 1,
        stepNumber: afterIndex + 2,
        description: 'New step description',
        expectedResults: [],
      };

      const updatedSteps = [...prevSteps];
      updatedSteps.splice(afterIndex + 1, 0, newStep);

      // Renumber all steps
      updatedSteps.forEach((step, index) => {
        step.stepNumber = index + 1;
      });

      return updatedSteps;
    });
  }, []);

  /**
   * Delete a step by ID
   */
  const deleteStep = useCallback((id: number) => {
    setSteps((prevSteps) => {
      const updatedSteps = prevSteps.filter((step) => step.id !== id);

      // Renumber remaining steps
      updatedSteps.forEach((step, index) => {
        step.stepNumber = index + 1;
      });

      return updatedSteps;
    });
  }, []);

  /**
   * Add an expected result to a step
   */
  const addExpectedResult = useCallback(
    (stepId: number, afterResultId?: number) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.id === stepId) {
            // Generate unique ID using sortBy utility
            const sortedResults = sortBy(step.expectedResults, 'id', 'desc');
            const maxId = sortedResults[0]?.id || 0;

            const newResult: ExpectedResult = {
              id: maxId + 1,
              description: 'New expected result',
            };

            // Insert after specific result if specified
            if (afterResultId !== undefined) {
              const afterIndex = step.expectedResults.findIndex(
                (res) => res.id === afterResultId
              );

              if (afterIndex !== -1) {
                const updatedResults = [...step.expectedResults];
                updatedResults.splice(afterIndex + 1, 0, newResult);
                return {
                  ...step,
                  expectedResults: updatedResults,
                };
              }
            }

            // Otherwise, add to the end
            return {
              ...step,
              expectedResults: [...step.expectedResults, newResult],
            };
          }
          return step;
        })
      );
    },
    []
  );

  /**
   * Delete an expected result from a step
   */
  const deleteExpectedResult = useCallback(
    (stepId: number, resultId: number) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              expectedResults: step.expectedResults.filter(
                (res) => res.id !== resultId
              ),
            };
          }
          return step;
        })
      );
    },
    []
  );

  /**
   * Update a step's description
   */
  const updateStepDescription = useCallback(
    (stepId: number, newDescription: string) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              description: newDescription,
            };
          }
          return step;
        })
      );
    },
    []
  );

  /**
   * Update an expected result's description
   */
  const updateExpectedResultDescription = useCallback(
    (stepId: number, resultId: number, newDescription: string) => {
      setSteps((prevSteps) =>
        prevSteps.map((step) => {
          if (step.id === stepId) {
            return {
              ...step,
              expectedResults: step.expectedResults.map((result) => {
                if (result.id === resultId) {
                  return {
                    ...result,
                    description: newDescription,
                  };
                }
                return result;
              }),
            };
          }
          return step;
        })
      );
    },
    []
  );

  return {
    steps,
    selectedStepId,
    selectedExpectedResultId,
    editingStepId,
    setSelectedStepId,
    setSelectedExpectedResultId,
    setEditingStepId,
    addStepAfter,
    deleteStep,
    addExpectedResult,
    deleteExpectedResult,
    updateStepDescription,
    updateExpectedResultDescription,
  };
};
