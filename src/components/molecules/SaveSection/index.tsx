import React from 'react';
import { Tooltip, Progress } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button } from '@/components/atoms';
import './index.scss';

interface SaveSectionProps {
  // Edit/Save state
  isReadOnly: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onEdit: () => void;
  onSave: () => void;
  // Optional customization
  editTooltip?: string;
  saveTooltip?: string;
  className?: string;
}

/**
 * SaveSection component
 *
 * Displays edit/save button with progress bar
 * Reusable component for tabs that need edit/save functionality
 */
export const SaveSection: React.FC<SaveSectionProps> = ({
  isReadOnly,
  isSaving,
  isSaveDisabled,
  onEdit,
  onSave,
  editTooltip = 'Edit Mode',
  saveTooltip = 'Save Changes',
  className = '',
}) => {
  return (
    <div className={`save-section ${className}`}>
      <Tooltip
        title={isReadOnly ? editTooltip : isSaving ? 'Saving...' : saveTooltip}
        placement="left"
      >
        {isReadOnly ? (
          <Button
            variant="primary"
            shape="circle"
            size="large"
            icon={<EditOutlined />}
            onClick={onEdit}
            className="section-edit-button"
          />
        ) : (
          <Button
            variant="primary"
            shape="circle"
            size="large"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={isSaving}
            disabled={isSaveDisabled}
            className="section-save-button"
          />
        )}
      </Tooltip>

      {/* Progress Bar for Saving */}
      {isSaving && (
        <div className="saving-progress">
          <Progress
            percent={0}
            size="small"
            status="active"
            strokeColor={{
              '0%': '#722ed1',
              '100%': '#531dab',
            }}
            showInfo={false}
          />
        </div>
      )}
    </div>
  );
};
