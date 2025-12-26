import React, { useState, useEffect, useRef } from 'react';
import { PlayCircleOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Input } from '@/components/atoms';
import { ActionBar } from '../ActionBar';
import './index.scss';

interface StepHeaderProps {
  stepNumber: number;
  description: string;
  onDelete?: () => void;
  onCopy?: () => void;
  onSetting?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
  onDescriptionChange?: (newDescription: string) => void;
  onAdd?: () => void;
  onAddExpectedResult?: () => void;
  onToggleExpand?: () => void;
  showAdd?: boolean;
  showAddExpectedResult?: boolean;
  isExpanded?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

/**
 * StepHeader molecule component
 *
 * Displays step number, description, and action buttons.
 * Refactored to use Typography and Input atoms.
 *
 * Features:
 * - Inline editing of step description
 * - Action bar with multiple actions
 * - Keyboard shortcuts (Enter to save, Escape to cancel)
 */
export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber,
  description,
  onDelete,
  onCopy,
  onSetting,
  onComment,
  onEdit,
  onDescriptionChange,
  onAdd,
  onAddExpectedResult,
  onToggleExpand,
  showAdd = false,
  showAddExpectedResult = false,
  isExpanded = true,
  onEditingChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(description);
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    setEditValue(description);
  }, [description]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    onEditingChange?.(true);
    onEdit?.();
  };

  const handleSave = () => {
    if (onDescriptionChange) {
      onDescriptionChange(editValue);
    }
    setIsEditing(false);
    onEditingChange?.(false);
  };

  const handleCancel = () => {
    setEditValue(description);
    setIsEditing(false);
    onEditingChange?.(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="step-header">
      <div className="step-title">
        <span className="step-number">{stepNumber}</span>
        <PlayCircleOutlined className="step-icon" />
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="step-description-input"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="step-description-text">{description}</span>
        )}
      </div>
      <div className="step-actions">
        <ActionBar
          onDelete={onDelete}
          onCopy={onCopy}
          onSetting={onSetting}
          onComment={onComment}
          onEdit={handleEdit}
          onAdd={onAdd}
          onAddExpectedResult={onAddExpectedResult}
          onToggleExpand={onToggleExpand}
          showAdd={showAdd}
          showAddExpectedResult={showAddExpectedResult}
          isExpanded={isExpanded}
        />
      </div>
    </div>
  );
};
