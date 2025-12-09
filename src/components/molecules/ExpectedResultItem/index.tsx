import React, { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import type { InputRef } from 'antd';
import { ActionBar } from '../ActionBar';
import './index.scss';

interface ExpectedResultItemProps {
  number: number;
  description: string;
  isSelected?: boolean;
  onSelect?: (e?: React.MouseEvent) => void;
  onDelete?: () => void;
  onCopy?: () => void;
  onSetting?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
  onDescriptionChange?: (newDescription: string) => void;
  onAdd?: () => void;
}

export const ExpectedResultItem: React.FC<ExpectedResultItemProps> = ({
  number,
  description,
  isSelected,
  onSelect,
  onDelete,
  onCopy,
  onSetting,
  onComment,
  onEdit,
  onDescriptionChange,
  onAdd,
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
    onEdit?.();
  };

  const handleSave = () => {
    if (onDescriptionChange) {
      onDescriptionChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(description);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className={`expected-result-item ${isSelected ? 'expected-result-item-selected' : ''}`}
      onClick={onSelect}
    >
      <div className="expected-result-content">
        <span className="expected-result-number">{number}</span>
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="expected-result-input"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="expected-result-text">{description}</span>
        )}
      </div>
      <div className="expected-result-actions">
        <ActionBar
          onDelete={onDelete}
          onCopy={onCopy}
          onSetting={onSetting}
          onComment={onComment}
          onEdit={handleEdit}
          onAdd={onAdd}
          showAdd={true}
        />
      </div>
    </div>
  );
};
