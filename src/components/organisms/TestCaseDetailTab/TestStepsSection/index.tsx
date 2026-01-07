import React from 'react';
import { NodeIndexOutlined } from '@ant-design/icons';
import { StepItem } from '@/components/molecules';
import type { TestStep } from '@/types';
import { useAnalysis } from '@/stores';
import { useStepsManagement } from '@/hooks';
import { TAB_KEYS } from '@/constants';
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

/**
 * TestStepsSection organism component
 *
 * Displays and manages test steps with expected results.
 * Uses useStepsManagement hook for all business logic.
 *
 * Features:
 * - Add/delete steps
 * - Add/delete expected results
 * - Edit step and expected result descriptions
 * - Selection and editing state management
 * - Automatic tab change tracking
 */
export const TestStepsSection: React.FC = () => {
  const { markTabAsChanged } = useAnalysis();

  const {
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
  } = useStepsManagement(initialSteps);

  // Wrapper functions to mark tab as changed
  const handleAddStepAfter = (afterStepId: number) => {
    addStepAfter(afterStepId);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  const handleDeleteStep = (id: number) => {
    deleteStep(id);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  const handleAddExpectedResult = (stepId: number, afterResultId?: number) => {
    addExpectedResult(stepId, afterResultId);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  const handleDeleteExpectedResult = (stepId: number, resultId: number) => {
    deleteExpectedResult(stepId, resultId);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  const handleStepDescriptionChange = (
    stepId: number,
    newDescription: string
  ) => {
    updateStepDescription(stepId, newDescription);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  const handleExpectedResultDescriptionChange = (
    stepId: number,
    resultId: number,
    newDescription: string
  ) => {
    updateExpectedResultDescription(stepId, resultId, newDescription);
    markTabAsChanged(TAB_KEYS.TEST_CASE_DETAILS);
  };

  return (
    <div className="steps-section-container">
      <h3 className="steps-title">
        <NodeIndexOutlined style={{ marginRight: '8px' }} />
        Steps
      </h3>

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
            isDisabled={editingStepId !== null && editingStepId !== step.id}
            onEditingChange={(isEditing) => {
              setEditingStepId(isEditing ? step.id : null);
            }}
          />
        ))}
      </div>
    </div>
  );
};
