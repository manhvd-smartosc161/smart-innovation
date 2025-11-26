import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ExpectedResult } from '@/types';
import { StepHeader, ExpectedResultItem } from '../';
import './index.scss';

interface StepItemProps {
  stepNumber: number;
  description: string;
  expectedResults: ExpectedResult[];
  isSelected?: boolean;
  onSelect?: () => void;
  onAddExpectedResult?: () => void;
  onDeleteExpectedResult?: (id: number) => void;
  onDeleteStep?: () => void;
}

export const StepItem: React.FC<StepItemProps> = ({
  stepNumber,
  description,
  expectedResults,
  isSelected,
  onSelect,
  onAddExpectedResult,
  onDeleteExpectedResult,
  onDeleteStep,
}) => {
  return (
    <div
      className={`step-item ${isSelected ? 'step-item-selected' : ''}`}
      onClick={onSelect}
    >
      <StepHeader
        stepNumber={stepNumber}
        description={description}
        onDelete={onDeleteStep}
      />

      {expectedResults.length > 0 && (
        <div className="expected-results-container">
          <div className="expected-results-header"># EXPECTED RESULT</div>
          {expectedResults.map((result, index) => (
            <ExpectedResultItem
              key={result.id}
              number={index + 1}
              description={result.description}
              onDelete={() => onDeleteExpectedResult?.(result.id)}
            />
          ))}
          <Button
            type="default"
            icon={<PlusOutlined />}
            className="add-verification-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddExpectedResult?.();
            }}
          >
            Add Verification
          </Button>
        </div>
      )}
    </div>
  );
};
