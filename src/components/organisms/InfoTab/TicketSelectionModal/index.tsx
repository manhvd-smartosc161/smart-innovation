import React, { useState } from 'react';
import { Modal, Checkbox, Input, message } from 'antd';
import {
  DownCircleOutlined,
  UpCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button } from '@/components/atoms';
import { MOCK_TICKETS } from '@/mock';
import './index.scss';

const { Search } = Input;

interface TicketSelectionModalProps {
  visible: boolean;
  selectedTicketIds: string[];
  onOk: (selectedIds: string[]) => void;
  onCancel: () => void;
}

export const TicketSelectionModal: React.FC<TicketSelectionModalProps> = ({
  visible,
  selectedTicketIds,
  onOk,
  onCancel,
}) => {
  const [searchText, setSearchText] = useState('');
  const [localSelectedIds, setLocalSelectedIds] =
    useState<string[]>(selectedTicketIds);
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null);

  // Reset local selection when modal opens
  React.useEffect(() => {
    if (visible) {
      setLocalSelectedIds(selectedTicketIds);
      setSearchText('');
      setExpandedTicketId(null);
    }
  }, [visible, selectedTicketIds]);

  const filteredTickets = MOCK_TICKETS.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchText.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckboxChange = (ticketId: string, checked: boolean) => {
    if (checked) {
      setLocalSelectedIds([...localSelectedIds, ticketId]);
    } else {
      setLocalSelectedIds(localSelectedIds.filter((id) => id !== ticketId));
    }
  };

  const handleSyncTicket = (ticketId: string) => {
    message.success(`Syncing ticket ${ticketId}...`);
    // TODO: Implement sync logic
  };

  const handleToggleExpand = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  };

  const handleOk = () => {
    onOk(localSelectedIds);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedTicketIds);
    onCancel();
  };

  return (
    <Modal
      title="Select Related Tickets"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      style={{ maxWidth: 'calc(100% - 32px)', top: 20 }}
      className="ticket-selection-modal"
    >
      <div className="modal-content">
        <Search
          placeholder="Search tickets by ID or title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <div className="ticket-list">
          {filteredTickets.map((ticket) => {
            const isExpanded = expandedTicketId === ticket.id;
            return (
              <div
                key={ticket.id}
                className={`ticket-item ${isExpanded ? 'expanded' : ''}`}
              >
                <div
                  className="ticket-header"
                  onClick={() => {
                    const isSelected = localSelectedIds.includes(ticket.id);
                    handleCheckboxChange(ticket.id, !isSelected);
                  }}
                >
                  <Checkbox
                    checked={localSelectedIds.includes(ticket.id)}
                    onChange={(e) =>
                      handleCheckboxChange(ticket.id, e.target.checked)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="ticket-checkbox"
                  />
                  <div className="ticket-info">
                    <span className="ticket-id">{ticket.id}</span>
                    <span className="ticket-title">{ticket.title}</span>
                  </div>
                  <div className="ticket-header-actions">
                    <Button
                      variant="primary"
                      size="small"
                      className="ticket-sync-btn"
                      icon={<SyncOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSyncTicket(ticket.id);
                      }}
                    >
                      Sync
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      className="ticket-expand-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleExpand(ticket.id);
                      }}
                    >
                      {isExpanded ? (
                        <UpCircleOutlined className="expand-icon expanded" />
                      ) : (
                        <DownCircleOutlined className="expand-icon" />
                      )}
                    </Button>
                  </div>
                </div>
                <div
                  className={`ticket-details ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="ticket-description">
                    <div className="description-header">Description:</div>
                    <div className="description-text">
                      {ticket.description || 'No description available'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {filteredTickets.length === 0 && (
            <div className="empty-state">No tickets found</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
