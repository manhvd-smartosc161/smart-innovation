import React, { useState } from 'react';
import { Input, Button, Dropdown, type MenuProps } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  GoogleOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
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

  const handleRequestReview = () => {
    console.log('Request Review clicked');
    // TODO: Implement request review logic
  };

  const handleCancelReview = () => {
    console.log('Cancel Review clicked');
    // TODO: Implement cancel review logic
  };

  const handleImportFromTickets = () => {
    console.log('Import from other tickets clicked');
    // TODO: Implement import from tickets logic
  };

  const handleImportFromGoogleSheets = () => {
    console.log('Import from Google Sheets clicked');
    // TODO: Implement import from Google Sheets logic
  };

  const handleImportFromExcel = () => {
    console.log('Import from Excel file clicked');
    // TODO: Implement import from Excel logic
  };

  const handleExportToJira = () => {
    console.log('Export to Jira clicked');
    // TODO: Implement export to Jira logic
  };

  const handleExportToGoogleSheets = () => {
    console.log('Export to Google Sheets clicked');
    // TODO: Implement export to Google Sheets logic
  };

  const handleExportToExcel = () => {
    console.log('Export to Excel file clicked');
    // TODO: Implement export to Excel logic
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'request-review',
      label: 'Request Review',
      icon: <EyeOutlined />,
      onClick: handleRequestReview,
      className: 'menu-item-request-review',
    },
    {
      key: 'cancel-review',
      label: 'Cancel Review',
      icon: <CloseCircleOutlined />,
      onClick: handleCancelReview,
      className: 'menu-item-cancel-review',
    },
    {
      type: 'divider',
    },
    {
      key: 'import',
      label: 'Import',
      disabled: true,
      style: { cursor: 'default' },
      className: 'menu-item-section-header',
    },
    {
      key: 'import-tickets',
      label: <span style={{ paddingLeft: '8px' }}>From other tickets</span>,
      icon: <FileTextOutlined />,
      onClick: handleImportFromTickets,
      className: 'menu-item-import',
    },
    {
      key: 'import-google-sheets',
      label: <span style={{ paddingLeft: '8px' }}>From Google Sheets</span>,
      icon: <GoogleOutlined />,
      onClick: handleImportFromGoogleSheets,
      className: 'menu-item-import',
    },
    {
      key: 'import-excel',
      label: <span style={{ paddingLeft: '8px' }}>From Excel file</span>,
      icon: <FileExcelOutlined />,
      onClick: handleImportFromExcel,
      className: 'menu-item-import',
    },
    {
      type: 'divider',
    },
    {
      key: 'export',
      label: 'Export',
      disabled: true,
      style: { cursor: 'default' },
      className: 'menu-item-section-header',
    },
    {
      key: 'export-jira',
      label: <span style={{ paddingLeft: '8px' }}>To Jira</span>,
      icon: <FileTextOutlined />,
      onClick: handleExportToJira,
      className: 'menu-item-export',
    },
    {
      key: 'export-google-sheets',
      label: <span style={{ paddingLeft: '8px' }}>To Google Sheets</span>,
      icon: <GoogleOutlined />,
      onClick: handleExportToGoogleSheets,
      className: 'menu-item-export',
    },
    {
      key: 'export-excel',
      label: <span style={{ paddingLeft: '8px' }}>To Excel file</span>,
      icon: <FileExcelOutlined />,
      onClick: handleExportToExcel,
      className: 'menu-item-export',
    },
  ];

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
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomLeft"
            overlayClassName="ticket-sidebar-dropdown"
            rootClassName="ticket-sidebar-dropdown"
          >
            <Button
              type="text"
              icon={<MoreOutlined />}
              className="header-icon-btn"
            />
          </Dropdown>
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
