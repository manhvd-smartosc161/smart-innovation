import React, { useState } from 'react';
import type { ExpectedResult } from '@/types';
import { StepHeader, ExpectedResultItem } from '../';
import './index.scss';

interface StepItemProps {
  stepNumber: number;
  description: string;
  expectedResults: ExpectedResult[];
  isSelected?: boolean;
  isDisabled?: boolean;
  onSelect?: () => void;
  onSelectStepOnly?: () => void;
  onAddExpectedResult?: (resultId?: number) => void;
  onDeleteExpectedResult?: (id: number) => void;
  onDeleteStep?: () => void;
  onAddStep?: () => void;
  onDescriptionChange?: (newDescription: string) => void;
  onExpectedResultDescriptionChange?: (
    resultId: number,
    newDescription: string
  ) => void;
  stepId?: number;
  selectedExpectedResultId?: { stepId: number; resultId: number } | null;
  onSelectExpectedResult?: (stepId: number, resultId: number) => void;
  onEditingChange?: (isEditing: boolean) => void;
}

export const StepItem: React.FC<StepItemProps> = ({
  stepNumber,
  description,
  expectedResults,
  isSelected,
  isDisabled,
  onSelect,
  onSelectStepOnly,
  onAddExpectedResult,
  onDeleteExpectedResult,
  onDeleteStep,
  onAddStep,
  onDescriptionChange,
  onExpectedResultDescriptionChange,
  stepId,
  selectedExpectedResultId,
  onSelectExpectedResult,
  onEditingChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [editingResultId, setEditingResultId] = useState<number | null>(null);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`step-item ${isSelected ? 'step-item-selected' : ''} ${isDisabled ? 'step-item-disabled' : ''}`}
      onClick={onSelectStepOnly || onSelect}
    >
      <StepHeader
        stepNumber={stepNumber}
        description={description}
        onDelete={onDeleteStep}
        onAdd={onAddStep}
        onAddExpectedResult={() => {
          if (onAddExpectedResult) {
            if (expectedResults.length > 0) {
              const lastResultId =
                expectedResults[expectedResults.length - 1].id;
              onAddExpectedResult(lastResultId);
            } else {
              onAddExpectedResult();
            }
          }
        }}
        onDescriptionChange={onDescriptionChange}
        onToggleExpand={
          expectedResults.length > 0 ? handleToggleExpand : undefined
        }
        showAdd={true}
        showAddExpectedResult={expectedResults.length === 0}
        isExpanded={isExpanded}
        onEditingChange={onEditingChange}
      />

      {expectedResults.length > 0 && (
        <div
          className={`expected-results-container ${
            isExpanded ? 'expanded' : 'collapsed'
          }`}
        >
          <div className="expected-results-header"># EXPECTED RESULT</div>
          <div className="expected-results-list">
            {expectedResults.map((result, index) => (
              <ExpectedResultItem
                key={result.id}
                number={index + 1}
                description={result.description}
                isSelected={
                  selectedExpectedResultId?.stepId === stepId &&
                  selectedExpectedResultId?.resultId === result.id
                }
                isDisabled={
                  editingResultId !== null && editingResultId !== result.id
                }
                onSelect={(e) => {
                  e?.stopPropagation();
                  if (stepId && onSelectExpectedResult) {
                    onSelectExpectedResult(stepId, result.id);
                  }
                  if (onSelect) {
                    onSelect();
                  }
                }}
                onDelete={() => onDeleteExpectedResult?.(result.id)}
                onAdd={() => onAddExpectedResult?.(result.id)}
                onDescriptionChange={(newDescription) =>
                  onExpectedResultDescriptionChange?.(result.id, newDescription)
                }
                onEditingChange={(isEditing) => {
                  setEditingResultId(isEditing ? result.id : null);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
