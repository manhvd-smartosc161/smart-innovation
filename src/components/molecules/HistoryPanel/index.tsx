import React from 'react';
import { Drawer, Timeline, Avatar, Tag, Empty } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './index.scss';

export interface HistoryItem {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: 'edit' | 'delete' | 'add';
  timestamp: Date;
  description: string;
  cell?: {
    row: number;
    itemId?: string; // Impact ID or Scope ID
    column: string;
    oldValue?: string;
    newValue?: string;
  };
}

interface HistoryPanelProps {
  visible: boolean;
  onClose: () => void;
  history: HistoryItem[];
  title?: string;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  visible,
  onClose,
  history,
  title = 'Change History',
}) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'edit':
        return <EditOutlined style={{ color: '#1890ff' }} />;
      case 'delete':
        return <DeleteOutlined style={{ color: '#ff4d4f' }} />;
      case 'add':
        return <PlusOutlined style={{ color: '#52c41a' }} />;
      default:
        return <EditOutlined />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'edit':
        return 'blue';
      case 'delete':
        return 'red';
      case 'add':
        return 'green';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={visible}
      size="default"
      className="history-panel"
    >
      {history.length === 0 ? (
        <Empty
          description="No changes yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Timeline
          items={history.map((item) => ({
            dot: getActionIcon(item.action),
            children: (
              <div className="history-item" key={item.id}>
                <div className="history-item-header">
                  <div className="user-info">
                    <Avatar
                      size="small"
                      src={item.user.avatar}
                      icon={<UserOutlined />}
                    >
                      {!item.user.avatar &&
                        item.user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <span className="user-name">{item.user.name}</span>
                  </div>
                  <Tag color={getActionColor(item.action)}>
                    {item.action.toUpperCase()}
                  </Tag>
                </div>
                <div className="history-item-description">
                  {item.description}
                </div>
                <div className="history-item-timestamp">
                  {formatTimestamp(item.timestamp)}
                </div>
              </div>
            ),
          }))}
        />
      )}
    </Drawer>
  );
};
