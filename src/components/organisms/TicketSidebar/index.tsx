import React, { useState } from 'react';
import { Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from '@/components/atoms';
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

  const handleRequestReview = (ticketId: string) => {
    console.log('Request Review clicked for ticket:', ticketId);
    // TODO: Implement request review logic
  };

  const handleCancelReview = (ticketId: string) => {
    console.log('Cancel Review clicked for ticket:', ticketId);
    // TODO: Implement cancel review logic
  };

  const handleImportFromTickets = (ticketId: string) => {
    console.log('Import from other tickets clicked for ticket:', ticketId);
    // TODO: Implement import from tickets logic
  };

  const handleImportFromGoogleSheets = (ticketId: string) => {
    console.log('Import from Google Sheets clicked for ticket:', ticketId);
    // TODO: Implement import from Google Sheets logic
  };

  const handleImportFromExcel = (ticketId: string) => {
    console.log('Import from Excel file clicked for ticket:', ticketId);
    // TODO: Implement import from Excel logic
  };

  const handleExportToJira = (ticketId: string) => {
    console.log('Export to Jira clicked for ticket:', ticketId);
    // TODO: Implement export to Jira logic
  };

  const handleExportToGoogleSheets = (ticketId: string) => {
    console.log('Export to Google Sheets clicked for ticket:', ticketId);
    // TODO: Implement export to Google Sheets logic
  };

  const handleExportToExcel = (ticketId: string) => {
    console.log('Export to Excel file clicked for ticket:', ticketId);
    // TODO: Implement export to Excel logic
  };

  return (
    <div className="ticket-sidebar">
      <div className="ticket-sidebar-header">
        <div className="search-box">
          <Input placeholder="" />
          <Button
            variant="text"
            icon={<PlusOutlined />}
            className="header-icon-btn"
          />
          <Button
            variant="text"
            icon={<DeleteOutlined />}
            danger
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
            onRequestReview={handleRequestReview}
            onCancelReview={handleCancelReview}
            onImportFromTickets={handleImportFromTickets}
            onImportFromGoogleSheets={handleImportFromGoogleSheets}
            onImportFromExcel={handleImportFromExcel}
            onExportToJira={handleExportToJira}
            onExportToGoogleSheets={handleExportToGoogleSheets}
            onExportToExcel={handleExportToExcel}
          />
        ))}
      </div>
    </div>
  );
};
