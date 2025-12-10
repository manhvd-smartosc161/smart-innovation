import React from 'react';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.scss';

interface ConfluencePageSelectorItemProps {
  id: string;
  pageUrl: string;
  pageTitle?: string;
  prompt: string;
  onPageUrlChange: (id: string, pageUrl: string) => void;
  onPromptChange: (id: string, prompt: string) => void;
  onDelete: (id: string) => void;
}

export const ConfluencePageSelectorItem: React.FC<
  ConfluencePageSelectorItemProps
> = ({
  id,
  pageUrl,
  pageTitle,
  prompt,
  onPageUrlChange,
  onPromptChange,
  onDelete,
}) => {
  return (
    <div className="confluence-page-selector-item">
      <div className="page-url-section">
        <Input
          placeholder="Enter Confluence Page URL"
          value={pageUrl}
          onChange={(e) => onPageUrlChange(id, e.target.value)}
        />
        {pageTitle && <span className="page-title">{pageTitle}</span>}
      </div>
      <div className="page-prompt-section">
        <Input.TextArea
          placeholder="Enter prompt to guide AI about this page..."
          value={prompt}
          onChange={(e) => onPromptChange(id, e.target.value)}
          rows={2}
        />
      </div>
      <div className="page-actions">
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(id)}
        />
      </div>
    </div>
  );
};
