import React from 'react';
import { Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@/components/atoms';
import { TicketItem } from '@/components/molecules';
import type { RelatedTicket } from '@/types';
import { INFO_TAB_LABELS, INFO_TAB_BUTTONS } from '@/constants';

interface TicketsSectionProps {
  tickets: RelatedTicket[];
  disabled?: boolean;
  hasEditingTicket: boolean;
  onOpenModal: () => void;
  onPromptChange: (ticketId: string, prompt: string) => void;
  onAccept: (ticketId: string) => void;
  onDiscard: (ticketId: string) => void;
  onEdit: (ticketId: string) => void;
  onDelete: (ticketId: string) => void;
  promptExamples?: Record<string, string>;
}

/**
 * TicketsSection component
 *
 * Displays the related tickets section in InfoTab
 */
export const TicketsSection: React.FC<TicketsSectionProps> = ({
  tickets,
  disabled = false,
  hasEditingTicket,
  onOpenModal,
  onPromptChange,
  onAccept,
  onDiscard,
  onEdit,
  onDelete,
  promptExamples,
}) => {
  return (
    <>
      <Divider />
      <div className="info-section">
        <div className="section-header">
          <h3>{INFO_TAB_LABELS.SELECT_RELATED_TICKETS}</h3>
          <Button
            variant="primary"
            icon={<PlusOutlined />}
            onClick={onOpenModal}
            disabled={disabled || hasEditingTicket}
          >
            {INFO_TAB_BUTTONS.ADD_TICKETS}
          </Button>
        </div>
        <div className="section-content">
          {tickets.length === 0 ? (
            <p className="empty-message">
              No tickets selected yet. Click "Add Tickets" to select from
              available tickets.
            </p>
          ) : (
            <div className="selected-items-container">
              <div className="selected-items-list">
                {tickets.map((ticket) => {
                  const isDisabled =
                    disabled || (hasEditingTicket && !ticket.isEditing);
                  return (
                    <TicketItem
                      key={ticket.id}
                      ticket={ticket}
                      isDisabled={isDisabled}
                      onPromptChange={onPromptChange}
                      onAccept={onAccept}
                      onDiscard={onDiscard}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      promptExamples={promptExamples}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
