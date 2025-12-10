import React from 'react';
import { Input, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.scss';

interface TicketSelectorItemProps {
  id: string;
  ticketId: string;
  ticketTitle?: string;
  prompt: string;
  onTicketIdChange: (id: string, ticketId: string) => void;
  onPromptChange: (id: string, prompt: string) => void;
  onDelete: (id: string) => void;
}

export const TicketSelectorItem: React.FC<TicketSelectorItemProps> = ({
  id,
  ticketId,
  ticketTitle,
  prompt,
  onTicketIdChange,
  onPromptChange,
  onDelete,
}) => {
  return (
    <div className="ticket-selector-item">
      <div className="ticket-id-section">
        <Input
          placeholder="Enter Ticket ID (e.g., JIRA-123)"
          value={ticketId}
          onChange={(e) => onTicketIdChange(id, e.target.value)}
        />
        {ticketTitle && <span className="ticket-title">{ticketTitle}</span>}
      </div>
      <div className="ticket-prompt-section">
        <Input.TextArea
          placeholder="Enter prompt to guide AI about this ticket..."
          value={prompt}
          onChange={(e) => onPromptChange(id, e.target.value)}
          rows={2}
        />
      </div>
      <div className="ticket-actions">
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(id)}
        />
      </div>
    </div>
  );
};
