import React from 'react';
import { ActionBar } from '../ActionBar';
import './index.scss';

interface ExpectedResultItemProps {
  number: number;
  description: string;
  onDelete?: () => void;
  onCopy?: () => void;
  onSetting?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
}

export const ExpectedResultItem: React.FC<ExpectedResultItemProps> = ({
  number,
  description,
  onDelete,
  onCopy,
  onSetting,
  onComment,
  onEdit,
}) => {
  return (
    <div className="expected-result-item">
      <div className="expected-result-content">
        <span className="expected-result-number">{number}</span>
        <span className="expected-result-text">{description}</span>
      </div>
      <ActionBar
        onDelete={onDelete}
        onCopy={onCopy}
        onSetting={onSetting}
        onComment={onComment}
        onEdit={onEdit}
      />
    </div>
  );
};
