import React from 'react';
import { Space } from 'antd';
import { IconButton } from '@/components/atoms';
import {
  CopyOutlined,
  SettingOutlined,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  AppstoreAddOutlined,
  UpCircleOutlined,
  DownCircleOutlined,
} from '@ant-design/icons';
import './index.scss';

interface ActionBarProps {
  onDelete?: () => void;
  onCopy?: () => void;
  onSetting?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
  onAdd?: () => void;
  onAddExpectedResult?: () => void;
  onToggleExpand?: () => void;
  showDelete?: boolean;
  showAdd?: boolean;
  showAddExpectedResult?: boolean;
  isExpanded?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onDelete,
  onCopy,
  onSetting,
  onComment,
  onEdit,
  onAdd,
  onAddExpectedResult,
  onToggleExpand,
  showDelete = true,
  showAdd = false,
  showAddExpectedResult = false,
  isExpanded = true,
}) => {
  return (
    <Space size={4} className="action-bar">
      {showAdd && (
        <IconButton
          icon={<PlusCircleOutlined />}
          onClick={onAdd}
          tooltip="Add Step"
        />
      )}
      {showAddExpectedResult && (
        <IconButton
          icon={<AppstoreAddOutlined />}
          onClick={onAddExpectedResult}
          tooltip="Add Expected Result"
        />
      )}
      <IconButton icon={<CopyOutlined />} onClick={onCopy} tooltip="Copy" />
      <IconButton
        icon={<SettingOutlined />}
        onClick={onSetting}
        tooltip="Settings"
      />
      <IconButton
        icon={<CommentOutlined />}
        onClick={onComment}
        tooltip="Comment"
      />
      <IconButton icon={<EditOutlined />} onClick={onEdit} tooltip="Edit" />
      {showDelete && (
        <IconButton
          icon={<DeleteOutlined />}
          onClick={onDelete}
          danger
          tooltip="Delete"
        />
      )}
      {onToggleExpand && (
        <IconButton
          icon={isExpanded ? <UpCircleOutlined /> : <DownCircleOutlined />}
          onClick={onToggleExpand}
          tooltip={isExpanded ? 'Collapse' : 'Expand'}
        />
      )}
    </Space>
  );
};
