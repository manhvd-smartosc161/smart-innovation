import React, { useState } from 'react';
import { Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, TextArea } from '@/components/atoms';
import type { ConfluencePage } from '@/types';
import './index.scss';

interface ConfluencePageItemProps {
  page: ConfluencePage;
  isDisabled?: boolean;
  onPromptChange: (pageUrl: string, prompt: string) => void;
  onAccept: (pageUrl: string) => void;
  onDiscard: (pageUrl: string) => void;
  onEdit: (pageUrl: string) => void;
  onDelete: (pageUrl: string) => void;
  promptExamples?: Record<string, string>;
}

export const ConfluencePageItem: React.FC<ConfluencePageItemProps> = ({
  page,
  isDisabled = false,
  onPromptChange,
  onAccept,
  onDiscard,
  onEdit,
  onDelete,
  promptExamples,
}) => {
  const [localPrompt, setLocalPrompt] = useState(page.prompt || '');

  React.useEffect(() => {
    setLocalPrompt(page.prompt || '');
  }, [page.prompt]);

  // Auto-fill prompt when entering edit mode with empty prompt
  React.useEffect(() => {
    if (page.isEditing && promptExamples && promptExamples['Confluence Page']) {
      const example = promptExamples['Confluence Page'];
      // Auto-fill if empty or if the current prompt is one of the other examples
      const isStandard = Object.values(promptExamples).includes(localPrompt);
      if (!localPrompt || !localPrompt.trim() || isStandard) {
        setLocalPrompt(example);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.isEditing, promptExamples]);

  const handleAccept = () => {
    if (!localPrompt || !localPrompt.trim()) {
      return;
    }
    onPromptChange(page.url, localPrompt);
    onAccept(page.url);
  };

  const handleDiscard = () => {
    setLocalPrompt(page.prompt || '');
    onDiscard(page.url);
  };

  const handleEditClick = () => {
    if (!isDisabled) {
      onEdit(page.url);
    }
  };

  const handleDeleteClick = () => {
    if (!isDisabled) {
      onDelete(page.url);
    }
  };

  if (page.isEditing) {
    return (
      <div
        className={`confluence-page-item editing ${isDisabled ? 'disabled' : ''}`}
      >
        <div className="page-header">
          <Tag color="blue" className="page-url-tag">
            {page.url}
          </Tag>
          <div className="page-actions">
            <Button
              variant="primary"
              icon={<CheckOutlined />}
              onClick={handleAccept}
              disabled={!localPrompt || !localPrompt.trim()}
            />
            <Button icon={<CloseOutlined />} onClick={handleDiscard} />
          </div>
        </div>
        <TextArea
          rows={3}
          placeholder="Enter prompt to guide AI about this page..."
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          className="page-prompt"
        />
      </div>
    );
  }

  return (
    <div
      className={`confluence-page-item readonly ${isDisabled ? 'disabled' : ''}`}
    >
      <div className="page-header">
        <Tag color="blue" className="page-url-tag">
          {page.url}
        </Tag>
        <div className="page-actions">
          <Button
            variant="text"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            disabled={isDisabled}
          />
          <Button
            variant="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteClick}
            disabled={isDisabled}
          />
        </div>
      </div>
      <div className="page-prompt-display">
        {localPrompt || (
          <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>
            No prompt entered yet
          </span>
        )}
      </div>
    </div>
  );
};
