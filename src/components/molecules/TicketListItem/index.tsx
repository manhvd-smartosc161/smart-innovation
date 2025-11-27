import React from 'react';
import { FileTextOutlined, MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import './index.scss';

interface TicketListItemProps {
  id: string;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  isSelected,
  onClick,
}) => {
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'Edit',
    },
    {
      key: '2',
      label: 'Delete',
      danger: true,
    },
  ];

  return (
    <div
      className={`ticket-list-item ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="ticket-icon">
        <FileTextOutlined />
      </div>
      <div className="ticket-info">
        <div className="ticket-id">{id}</div>
        {/* <div className="ticket-title">{title}</div> */}
      </div>
      <div className="ticket-actions" onClick={(e) => e.stopPropagation()}>
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="more-btn"
          />
        </Dropdown>
      </div>
    </div>
  );
};
