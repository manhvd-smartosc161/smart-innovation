import React, { useState } from 'react';
import { StepItem } from '@/components/molecules';
import type { TestStep } from '@/types';
import './index.scss';

const initialSteps: TestStep[] = [
  {
    id: 1,
    stepNumber: 1,
    description: 'Navigate to the product page.',
    expectedResults: [],
  },
  {
    id: 2,
    stepNumber: 2,
    description: 'Add product to cart with an invalid quantity (e.g., -1).',
    expectedResults: [
      {
        id: 1,
        description: 'An error message "Invalid quantity" should be displayed.',
      },
      {
        id: 2,
        description: 'Order should not be created.',
      },
    ],
  },
  {
    id: 3,
    stepNumber: 3,
    description: 'Navigate to the product page.',
    expectedResults: [],
  },
  {
    id: 4,
    stepNumber: 4,
    description: 'Click on the product link',
    expectedResults: [],
  },
];

export const StepsSection: React.FC = () => {
  const [steps, setSteps] = useState<TestStep[]>(initialSteps);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(2);
  const [selectedExpectedResultId, setSelectedExpectedResultId] = useState<{
    stepId: number;
    resultId: number;
  } | null>(null);

  const handleAddStepAfter = (afterStepId: number) => {
    const afterIndex = steps.findIndex((step) => step.id === afterStepId);
    if (afterIndex === -1) return;

    const newStep: TestStep = {
      id: steps.length + 1,
      stepNumber: afterIndex + 2,
      description: 'New step description',
      expectedResults: [],
    };

    const updatedSteps = [...steps];
    updatedSteps.splice(afterIndex + 1, 0, newStep);

    updatedSteps.forEach((step, index) => {
      step.stepNumber = index + 1;
    });

    setSteps(updatedSteps);
  };

  const handleDeleteStep = (id: number) => {
    const updatedSteps = steps.filter((step) => step.id !== id);
    updatedSteps.forEach((step, index) => {
      step.stepNumber = index + 1;
    });
    setSteps(updatedSteps);
  };

  const handleAddExpectedResult = (stepId: number, afterResultId?: number) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          const newResult = {
            id: step.expectedResults.length + 1,
            description: 'New expected result',
          };

          if (afterResultId) {
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

          return {
            ...step,
            expectedResults: [...step.expectedResults, newResult],
          };
        }
        return step;
      })
    );
  };

  const handleDeleteExpectedResult = (stepId: number, resultId: number) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          const updatedResults = step.expectedResults.filter(
            (res) => res.id !== resultId
          );
          return {
            ...step,
            expectedResults: updatedResults,
          };
        }
        return step;
      })
    );
  };

  const handleStepDescriptionChange = (
    stepId: number,
    newDescription: string
  ) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            description: newDescription,
          };
        }
        return step;
      })
    );
  };

  const handleExpectedResultDescriptionChange = (
    stepId: number,
    resultId: number,
    newDescription: string
  ) => {
    setSteps(
      steps.map((step) => {
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
  };

  return (
    <div className="steps-section-container">
      <h3 className="steps-title">Steps</h3>

      <div className="steps-content">
        <div className="step-execute-header"># STEP TO EXECUTE</div>
        {steps.map((step) => (
          <StepItem
            key={step.id}
            stepNumber={step.stepNumber}
            description={step.description}
            expectedResults={step.expectedResults}
            isSelected={selectedStepId === step.id}
            onSelect={() => {
              setSelectedStepId(step.id);
            }}
            onSelectStepOnly={() => {
              setSelectedStepId(step.id);
              setSelectedExpectedResultId(null);
            }}
            onAddExpectedResult={(resultId) =>
              handleAddExpectedResult(step.id, resultId)
            }
            onDeleteExpectedResult={(resultId) =>
              handleDeleteExpectedResult(step.id, resultId)
            }
            onDeleteStep={() => handleDeleteStep(step.id)}
            onAddStep={() => handleAddStepAfter(step.id)}
            onDescriptionChange={(newDescription) =>
              handleStepDescriptionChange(step.id, newDescription)
            }
            onExpectedResultDescriptionChange={(resultId, newDescription) =>
              handleExpectedResultDescriptionChange(
                step.id,
                resultId,
                newDescription
              )
            }
            stepId={step.id}
            selectedExpectedResultId={selectedExpectedResultId}
            onSelectExpectedResult={(stepId, resultId) =>
              setSelectedExpectedResultId({ stepId, resultId })
            }
          />
        ))}
      </div>
    </div>
  );
};
