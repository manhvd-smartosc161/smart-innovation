import React from 'react';
import { Space } from 'antd';
import { IconButton } from '@/components/atoms';
import {
  CopyOutlined,
  SettingOutlined,
  CommentOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import './index.scss';

interface ActionBarProps {
  onDelete?: () => void;
  onCopy?: () => void;
  onSetting?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
  showDelete?: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onDelete,
  onCopy,
  onSetting,
  onComment,
  onEdit,
  showDelete = true,
}) => {
  return (
    <Space size={4} className="action-bar">
      <IconButton icon={<CopyOutlined />} onClick={onCopy} />
      <IconButton icon={<SettingOutlined />} onClick={onSetting} />
      <IconButton icon={<CommentOutlined />} onClick={onComment} />
      <IconButton icon={<EditOutlined />} onClick={onEdit} />
      {showDelete && (
        <IconButton icon={<DeleteOutlined />} onClick={onDelete} danger />
      )}
    </Space>
  );
};
