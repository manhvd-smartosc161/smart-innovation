import React from 'react';
import {
  FileTextOutlined,
  MoreOutlined,
  EyeOutlined,
  CloseCircleOutlined,
  GoogleOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import type { TicketStatus } from '@/types';
import './index.scss';

interface TicketListItemProps {
  id: string;
  title: string;
  status: TicketStatus;
  isSelected?: boolean;
  onClick?: () => void;
  onRequestReview?: (ticketId: string) => void;
  onImportFromTickets?: (ticketId: string) => void;
  onImportFromJira?: (ticketId: string) => void;
  onImportFromGoogleSheets?: (ticketId: string) => void;
  onExportToTickets?: (ticketId: string) => void;
  onExportToJira?: (ticketId: string) => void;
  onExportToGoogleSheets?: (ticketId: string) => void;
  onApprove?: (ticketId: string) => void;
  onReject?: (ticketId: string) => void;
  onResolve?: (ticketId: string) => void;
  onCancel?: (ticketId: string) => void;
  onCreateExecution?: (ticketId: string) => void;
  onDelete?: (ticketId: string) => void;
}

export const TicketListItem: React.FC<TicketListItemProps> = ({
  id,
  status,
  isSelected,
  onClick,
  onRequestReview,
  onImportFromTickets,
  onImportFromJira,
  onImportFromGoogleSheets,
  onExportToTickets,
  onExportToJira,
  onExportToGoogleSheets,
  onApprove,
  onReject,
  onResolve,
  onCancel,
  onCreateExecution,
  onDelete,
}) => {
  const getMenuItems = (): MenuProps['items'] => {
    const deleteItem: MenuProps['items'] = [
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => onDelete?.(id),
        className: 'menu-item-delete',
      },
    ];

    switch (status) {
      case 'Drafting':
        return [
          {
            key: 'request-review',
            label: 'Request Review',
            icon: <EyeOutlined />,
            onClick: () => onRequestReview?.(id),
            className: 'menu-item-request-review',
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
            label: (
              <span style={{ paddingLeft: '8px' }}>From other tickets</span>
            ),
            icon: <FileTextOutlined />,
            onClick: () => onImportFromTickets?.(id),
            className: 'menu-item-import',
          },
          {
            key: 'import-jira',
            label: <span style={{ paddingLeft: '8px' }}>From Jira</span>,
            icon: <FileTextOutlined />,
            onClick: () => onImportFromJira?.(id),
            className: 'menu-item-import',
          },
          {
            key: 'import-google-sheets',
            label: (
              <span style={{ paddingLeft: '8px' }}>From Google Sheets</span>
            ),
            icon: <GoogleOutlined />,
            onClick: () => onImportFromGoogleSheets?.(id),
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
            key: 'export-tickets',
            label: <span style={{ paddingLeft: '8px' }}>To other tickets</span>,
            icon: <FileTextOutlined />,
            onClick: () => onExportToTickets?.(id),
            className: 'menu-item-export',
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
          ...deleteItem,
        ];

      case 'Reviewing':
        return [
          {
            key: 'approve',
            label: 'Approve',
            icon: <CheckOutlined />,
            onClick: () => onApprove?.(id),
            className: 'menu-item-approve',
          },
          {
            key: 'reject',
            label: 'Reject',
            icon: <CloseOutlined />,
            onClick: () => onReject?.(id),
            className: 'menu-item-reject',
          },
          {
            key: 'cancel',
            label: 'Cancel',
            icon: <CloseCircleOutlined />,
            onClick: () => onCancel?.(id),
            className: 'menu-item-cancel',
          },
          ...deleteItem,
        ];

      case 'Rejected':
        return [
          {
            key: 'resolve',
            label: 'Resolve',
            icon: <CheckCircleOutlined />,
            onClick: () => onResolve?.(id),
            className: 'menu-item-resolve',
          },
          ...deleteItem,
        ];

      case 'Resolved':
        return [
          {
            key: 'request-review',
            label: 'Request Review',
            icon: <EyeOutlined />,
            onClick: () => onRequestReview?.(id),
            className: 'menu-item-request-review',
          },
          ...deleteItem,
        ];

      case 'Approved':
        return [
          {
            key: 'create-execution',
            label: 'Create Execution',
            icon: <RocketOutlined />,
            onClick: () => onCreateExecution?.(id),
            className: 'menu-item-create-execution',
          },
          ...deleteItem,
        ];

      case 'Cancelled':
        return [
          {
            key: 'request-review',
            label: 'Request Review',
            icon: <EyeOutlined />,
            onClick: () => onRequestReview?.(id),
            className: 'menu-item-request-review',
          },
          ...deleteItem,
        ];

      default:
        return [];
    }
  };

  const items = getMenuItems();

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
