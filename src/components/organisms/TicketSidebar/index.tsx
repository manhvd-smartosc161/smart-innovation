import React, { useState, useMemo } from 'react';
import { Input } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from '@/components/atoms';
import { TicketListItem } from '@/components/molecules';
import type { TicketStatus } from '@/types';
import { MOCK_TICKETS_BY_STATUS } from '@/mock/ticket';
import './index.scss';

export const TicketSidebar: React.FC<{ activeTab: string }> = ({
  activeTab,
}) => {
  // Get tickets based on active tab
  const tickets = useMemo(
    () => MOCK_TICKETS_BY_STATUS[activeTab as TicketStatus] || [],
    [activeTab]
  );

  const [selectedTicketId, setSelectedTicketId] =
    useState<string>('SAIT-000001');

  const handleRequestReview = (ticketId: string) => {
    console.log('Request Review clicked for ticket:', ticketId);
    // TODO: Implement request review logic
  };

  const handleApprove = (ticketId: string) => {
    console.log('Approve clicked for ticket:', ticketId);
    // TODO: Implement approve logic
  };

  const handleReject = (ticketId: string) => {
    console.log('Reject clicked for ticket:', ticketId);
    // TODO: Implement reject logic
  };

  const handleResolve = (ticketId: string) => {
    console.log('Resolve clicked for ticket:', ticketId);
    // TODO: Implement resolve logic
  };

  const handleCancel = (ticketId: string) => {
    console.log('Cancel clicked for ticket:', ticketId);
    // TODO: Implement cancel logic
  };

  const handleCreateExecution = (ticketId: string) => {
    console.log('Create Execution clicked for ticket:', ticketId);
    // TODO: Implement create execution logic
  };

  const handleImportFromTickets = (ticketId: string) => {
    console.log('Import from other tickets clicked for ticket:', ticketId);
    // TODO: Implement import from tickets logic
  };

  const handleImportFromJira = (ticketId: string) => {
    console.log('Import from Jira clicked for ticket:', ticketId);
    // TODO: Implement import from Jira logic
  };

  const handleImportFromGoogleSheets = (ticketId: string) => {
    console.log('Import from Google Sheets clicked for ticket:', ticketId);
    // TODO: Implement import from Google Sheets logic
  };

  const handleExportToTickets = (ticketId: string) => {
    console.log('Export to other tickets clicked for ticket:', ticketId);
    // TODO: Implement export to tickets logic
  };

  const handleExportToJira = (ticketId: string) => {
    console.log('Export to Jira clicked for ticket:', ticketId);
    // TODO: Implement export to Jira logic
  };

  const handleExportToGoogleSheets = (ticketId: string) => {
    console.log('Export to Google Sheets clicked for ticket:', ticketId);
    // TODO: Implement export to Google Sheets logic
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
            status={activeTab as TicketStatus}
            isSelected={selectedTicketId === ticket.id}
            onClick={() => setSelectedTicketId(ticket.id)}
            onRequestReview={handleRequestReview}
            onImportFromTickets={handleImportFromTickets}
            onImportFromJira={handleImportFromJira}
            onImportFromGoogleSheets={handleImportFromGoogleSheets}
            onExportToTickets={handleExportToTickets}
            onExportToJira={handleExportToJira}
            onExportToGoogleSheets={handleExportToGoogleSheets}
            onApprove={handleApprove}
            onReject={handleReject}
            onResolve={handleResolve}
            onCancel={handleCancel}
            onCreateExecution={handleCreateExecution}
          />
        ))}
      </div>
    </div>
  );
};
