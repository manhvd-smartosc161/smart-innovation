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
      {showAdd && <IconButton icon={<PlusCircleOutlined />} onClick={onAdd} />}
      {showAddExpectedResult && (
        <IconButton
          icon={<AppstoreAddOutlined />}
          onClick={onAddExpectedResult}
        />
      )}
      <IconButton icon={<CopyOutlined />} onClick={onCopy} />
      <IconButton icon={<SettingOutlined />} onClick={onSetting} />
      <IconButton icon={<CommentOutlined />} onClick={onComment} />
      <IconButton icon={<EditOutlined />} onClick={onEdit} />
      {showDelete && (
        <IconButton icon={<DeleteOutlined />} onClick={onDelete} danger />
      )}
      {onToggleExpand && (
        <IconButton
          icon={isExpanded ? <UpCircleOutlined /> : <DownCircleOutlined />}
          onClick={onToggleExpand}
        />
      )}
    </Space>
  );
};
