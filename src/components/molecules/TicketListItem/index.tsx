import React from 'react';
import {
  FileTextOutlined,
  MoreOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  GoogleOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import './index.scss';

interface TicketListItemProps {
  id: string;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  onRequestReview?: (ticketId: string) => void;
  onCancelReview?: (ticketId: string) => void;
  onImportFromTickets?: (ticketId: string) => void;
  onImportFromGoogleSheets?: (ticketId: string) => void;
  onImportFromExcel?: (ticketId: string) => void;
  onExportToJira?: (ticketId: string) => void;
  onExportToGoogleSheets?: (ticketId: string) => void;
  onExportToExcel?: (ticketId: string) => void;
}

export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  isSelected,
  onClick,
  onRequestReview,
  onCancelReview,
  onImportFromTickets,
  onImportFromGoogleSheets,
  onImportFromExcel,
  onExportToJira,
  onExportToGoogleSheets,
  onExportToExcel,
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'request-review',
      label: 'Request Review',
      icon: <EyeOutlined />,
      onClick: () => onRequestReview?.(id),
      className: 'menu-item-request-review',
    },
    {
      key: 'cancel-review',
      label: 'Cancel Review',
      icon: <CloseCircleOutlined />,
      onClick: () => onCancelReview?.(id),
      className: 'menu-item-cancel-review',
    },
    {
      type: 'divider',
    },
    {
      key: 'import',
      label: 'IMPORT',
      disabled: true,
      style: { cursor: 'default' },
      className: 'menu-item-section-header',
    },
    {
      key: 'import-tickets',
      label: <span style={{ paddingLeft: '8px' }}>From other tickets</span>,
      icon: <FileTextOutlined />,
      onClick: () => onImportFromTickets?.(id),
      className: 'menu-item-import',
    },
    {
      key: 'import-google-sheets',
      label: <span style={{ paddingLeft: '8px' }}>From Google Sheets</span>,
      icon: <GoogleOutlined />,
      onClick: () => onImportFromGoogleSheets?.(id),
      className: 'menu-item-import',
    },
    {
      key: 'import-excel',
      label: <span style={{ paddingLeft: '8px' }}>From Excel file</span>,
      icon: <FileExcelOutlined />,
      onClick: () => onImportFromExcel?.(id),
      className: 'menu-item-import',
    },
    {
      type: 'divider',
    },
    {
      key: 'export',
      label: 'EXPORT',
      disabled: true,
      style: { cursor: 'default' },
      className: 'menu-item-section-header',
    },
    {
      key: 'export-jira',
      label: <span style={{ paddingLeft: '8px' }}>To Jira</span>,
      icon: <FileTextOutlined />,
      onClick: () => onExportToJira?.(id),
      className: 'menu-item-export',
    },
    {
      key: 'export-google-sheets',
      label: <span style={{ paddingLeft: '8px' }}>To Google Sheets</span>,
      icon: <GoogleOutlined />,
      onClick: () => onExportToGoogleSheets?.(id),
      className: 'menu-item-export',
    },
    {
      key: 'export-excel',
      label: <span style={{ paddingLeft: '8px' }}>To Excel file</span>,
      icon: <FileExcelOutlined />,
      onClick: () => onExportToExcel?.(id),
      className: 'menu-item-export',
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
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          classNames={{ root: 'ticket-sidebar-dropdown' }}
          rootClassName="ticket-sidebar-dropdown"
        >
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
