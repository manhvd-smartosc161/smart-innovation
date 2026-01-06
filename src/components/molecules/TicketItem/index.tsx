import React, { useState } from 'react';
import { Tag } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { Button, TextArea } from '@/components/atoms';
import type { RelatedTicket } from '@/types';
import './index.scss';

interface TicketItemProps {
  ticket: RelatedTicket;
  isDisabled?: boolean;
  onPromptChange: (ticketId: string, prompt: string) => void;
  onAccept: (ticketId: string) => void;
  onDiscard: (ticketId: string) => void;
  onEdit: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
  promptExamples?: Record<string, string>;
}

export const TicketItem: React.FC<TicketItemProps> = ({
  ticket,
  isDisabled = false,
  onPromptChange,
  onAccept,
  onDiscard,
  onEdit,
  onDelete,
  promptExamples,
}) => {
  const [localPrompt, setLocalPrompt] = useState(ticket.prompt);

  React.useEffect(() => {
    setLocalPrompt(ticket.prompt);
  }, [ticket.prompt]);

  // Auto-fill prompt when entering edit mode with empty prompt
  React.useEffect(() => {
    if (ticket.isEditing && promptExamples && promptExamples['Ticket']) {
      const example = promptExamples['Ticket'];
      // Auto-fill if empty or if the current prompt is one of the other examples
      const isStandard = Object.values(promptExamples).includes(localPrompt);
      if (!localPrompt || !localPrompt.trim() || isStandard) {
        setLocalPrompt(example);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticket.isEditing, promptExamples]);

  const handleAccept = () => {
    if (!localPrompt || !localPrompt.trim()) {
      return;
    }
    onPromptChange(ticket.ticketId, localPrompt);
    onAccept(ticket.ticketId);
  };

  const handleDiscard = () => {
    setLocalPrompt(ticket.prompt);
    onDiscard(ticket.ticketId);
  };

  const handleEditClick = () => {
    if (!isDisabled) {
      onEdit(ticket.ticketId);
    }
  };

  const handleDeleteClick = () => {
    if (!isDisabled) {
      onDelete(ticket.ticketId);
    }
  };

  if (ticket.isEditing) {
    return (
      <div className={`ticket-item editing ${isDisabled ? 'disabled' : ''}`}>
        <div className="ticket-header">
          <Tag color="blue" className="ticket-id-tag">
            {ticket.ticketId}
          </Tag>
          <div className="ticket-actions">
            <Button
              variant="primary"
              icon={<CheckOutlined />}
              onClick={handleAccept}
              disabled={!localPrompt || !localPrompt.trim()}
            />
            <Button icon={<CloseOutlined />} onClick={handleDiscard} />
          </div>
        </div>
        <TextArea
          rows={3}
          placeholder="Enter prompt to guide AI about this ticket..."
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          className="ticket-prompt"
        />
      </div>
    );
  }

  return (
    <div className={`ticket-item readonly ${isDisabled ? 'disabled' : ''}`}>
      <div className="ticket-header">
        <Tag color="blue" className="ticket-id-tag">
          {ticket.ticketId}
        </Tag>
        <div className="ticket-actions">
          <Button
            variant="text"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            disabled={isDisabled}
          />
          <Button
            variant="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteClick}
            disabled={isDisabled}
          />
        </div>
      </div>
      <div className="ticket-prompt-display">
        {localPrompt || (
          <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>
            No prompt entered yet
          </span>
        )}
      </div>
    </div>
  );
};
