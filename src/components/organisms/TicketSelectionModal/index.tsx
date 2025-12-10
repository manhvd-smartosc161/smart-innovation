import React, { useState } from 'react';
import { Modal, Checkbox, Input } from 'antd';
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

  // Reset local selection when modal opens
  React.useEffect(() => {
    if (visible) {
      setLocalSelectedIds(selectedTicketIds);
      setSearchText('');
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
      width={600}
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
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="ticket-item">
              <Checkbox
                checked={localSelectedIds.includes(ticket.id)}
                onChange={(e) =>
                  handleCheckboxChange(ticket.id, e.target.checked)
                }
              >
                <span className="ticket-id">{ticket.id}</span>
                <span className="ticket-title">{ticket.title}</span>
              </Checkbox>
            </div>
          ))}
          {filteredTickets.length === 0 && (
            <div className="empty-state">No tickets found</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
