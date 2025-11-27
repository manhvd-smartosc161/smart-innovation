import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { PlusOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import { TicketListItem } from '@/components/molecules';
import type { Ticket } from '@/types';
import './index.scss';

const initialTickets: Ticket[] = [
  {
    id: 'SAIT-000001',
    key: 'SAIT-000001',
    title: 'Create order with invalid data',
  },
  { id: 'SAIT-000002', key: 'SAIT-000002', title: 'Verify login page' },
  { id: 'SAIT-000003', key: 'SAIT-000003', title: 'Check payment gateway' },
  { id: 'SAIT-000004', key: 'SAIT-000004', title: 'Test user registration' },
  {
    id: 'SAIT-000005',
    key: 'SAIT-000005',
    title: 'Validate search functionality',
  },
  { id: 'SAIT-000006', key: 'SAIT-000006', title: 'Check product details' },
  { id: 'SAIT-000007', key: 'SAIT-000007', title: 'Verify cart updates' },
  { id: 'SAIT-000008', key: 'SAIT-000008', title: 'Test checkout process' },
];

export const TicketSidebar: React.FC = () => {
  const [tickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicketId, setSelectedTicketId] =
    useState<string>('SAIT-000001');

  return (
    <div className="ticket-sidebar">
      <div className="ticket-sidebar-header">
        <div className="search-box">
          <Input placeholder="" />
          <Button
            type="text"
            icon={<PlusOutlined />}
            className="header-icon-btn"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            className="header-icon-btn"
          />
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="header-icon-btn"
          />
        </div>
      </div>
      <div className="ticket-list">
        {tickets.map((ticket) => (
          <TicketListItem
            key={ticket.id}
            id={ticket.id}
            title={ticket.title}
            isSelected={selectedTicketId === ticket.id}
            onClick={() => setSelectedTicketId(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};
