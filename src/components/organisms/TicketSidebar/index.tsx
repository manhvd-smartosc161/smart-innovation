import React, { useState, useMemo } from 'react';
import { Input, Select } from 'antd';
import {
  PlusOutlined,
  FormOutlined,
  EyeOutlined,
  StopOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  LikeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Button } from '@/components/atoms';
import { TicketListItem } from '@/components/molecules';
import type { TicketStatus } from '@/types';
import { WORKFLOW_TAB_KEYS, WORKFLOW_TAB_LABELS } from '@/constants';
import { MOCK_TICKETS_BY_STATUS } from '@/mock/ticket';
import './index.scss';

interface TicketSidebarProps {
  activeTab: string;
  onStatusChange: (status: string) => void;
}

const statusOptions = [
  {
    value: WORKFLOW_TAB_KEYS.DRAFTING,
    label: WORKFLOW_TAB_LABELS.DRAFTING,
    icon: <FormOutlined />,
    className: 'status-drafting',
  },
  {
    value: WORKFLOW_TAB_KEYS.REVIEWING,
    label: WORKFLOW_TAB_LABELS.REVIEWING,
    icon: <EyeOutlined />,
    className: 'status-reviewing',
  },
  {
    value: WORKFLOW_TAB_KEYS.CANCELLED,
    label: WORKFLOW_TAB_LABELS.CANCELLED,
    icon: <StopOutlined />,
    className: 'status-cancelled',
  },
  {
    value: WORKFLOW_TAB_KEYS.REJECTED,
    label: WORKFLOW_TAB_LABELS.REJECTED,
    icon: <CloseCircleOutlined />,
    className: 'status-rejected',
  },
  {
    value: WORKFLOW_TAB_KEYS.RESOLVED,
    label: WORKFLOW_TAB_LABELS.RESOLVED,
    icon: <CheckCircleOutlined />,
    className: 'status-resolved',
  },
  {
    value: WORKFLOW_TAB_KEYS.APPROVED,
    label: WORKFLOW_TAB_LABELS.APPROVED,
    icon: <LikeOutlined />,
    className: 'status-approved',
  },
];

export const TicketSidebar: React.FC<TicketSidebarProps> = ({
  activeTab,
  onStatusChange,
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

  const handleDelete = (ticketId: string) => {
    console.log('Delete clicked for ticket:', ticketId);
    // TODO: Implement delete logic
  };

  return (
    <div className="ticket-sidebar">
      <div className="ticket-sidebar-header">
        <div className="header-card">
          <div className="status-row">
            <Select
              value={activeTab}
              onChange={onStatusChange}
              className="status-select"
              popupClassName="status-select-dropdown"
              listHeight={400} // Ensure all items show without scroll
              bordered={false}
              suffixIcon={<div className="custom-arrow" />}
              options={statusOptions.map((opt) => ({
                value: opt.value,
                label: (
                  <div className={`status-option-label ${opt.className}`}>
                    <span className="icon">{opt.icon}</span>
                    {opt.label}
                  </div>
                ),
              }))}
            />
          </div>
          <div className="search-row">
            <Input
              placeholder="Search..."
              prefix={
                <SearchOutlined
                  style={{ color: 'var(--color-text-quaternary)' }}
                />
              }
              className="search-input"
            />
            <Button
              variant="text"
              icon={<PlusOutlined />}
              className="add-btn"
            />
          </div>
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
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
