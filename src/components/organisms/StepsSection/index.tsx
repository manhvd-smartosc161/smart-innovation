import React, { useState } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
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

  const handleAddStep = () => {
    const newStep: TestStep = {
      id: steps.length + 1,
      stepNumber: steps.length + 1,
      description: 'New step description',
      expectedResults: [],
    };
    setSteps([...steps, newStep]);
  };

  const handleDeleteStep = (id: number) => {
    setSteps(steps.filter((step) => step.id !== id));
  };

  const handleAddExpectedResult = (stepId: number) => {
    setSteps(
      steps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            expectedResults: [
              ...step.expectedResults,
              {
                id: step.expectedResults.length + 1,
                description: 'New expected result',
              },
            ],
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
            onSelect={() => setSelectedStepId(step.id)}
            onAddExpectedResult={() => handleAddExpectedResult(step.id)}
            onDeleteExpectedResult={(resultId) =>
              handleDeleteExpectedResult(step.id, resultId)
            }
            onDeleteStep={() => handleDeleteStep(step.id)}
          />
        ))}
      </div>

      <Button
        type="default"
        icon={<PlusOutlined />}
        onClick={handleAddStep}
        className="add-step-btn"
      >
        Add Step
      </Button>
    </div>
  );
};
