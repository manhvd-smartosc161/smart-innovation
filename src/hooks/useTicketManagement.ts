import { useState } from 'react';
import type { RelatedTicket } from '@/types';

/**
 * Custom hook for managing related tickets in InfoTab
 *
 * Handles all ticket operations including:
 * - Ticket selection from modal
 * - Editing ticket prompts
 * - Accepting/discarding changes
 * - Deleting tickets
 */
export const useTicketManagement = () => {
  const [tickets, setTickets] = useState<RelatedTicket[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectionOk = (selectedIds: string[]) => {
    const hasEditingTicket = tickets.some((ticket) => ticket.isEditing);
    if (hasEditingTicket) {
      return;
    }

    const newTickets = selectedIds.map((ticketId) => {
      const existing = tickets.find((t) => t.ticketId === ticketId);
      return (
        existing || {
          id: Date.now().toString() + Math.random(),
          ticketId,
          prompt: '',
          isEditing: false,
        }
      );
    });
    setTickets(newTickets);
    setModalVisible(false);
  };

  const handlePromptChange = (ticketId: string, prompt: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId ? { ...ticket, prompt } : ticket
      )
    );
  };

  const handleAccept = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId ? { ...ticket, isEditing: false } : ticket
      )
    );
  };

  const handleDiscard = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId
          ? { ...ticket, isEditing: false, prompt: ticket.prompt }
          : ticket
      )
    );
  };

  const handleEdit = (ticketId: string) => {
    const hasEditingTicket = tickets.some((ticket) => ticket.isEditing);
    if (hasEditingTicket) {
      return;
    }

    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId ? { ...ticket, isEditing: true } : ticket
      )
    );
  };

  const handleDelete = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.ticketId !== ticketId));
  };

  const hasEditingTicket = tickets.some((ticket) => ticket.isEditing);

  return {
    tickets,
    setTickets,
    modalVisible,
    setModalVisible,
    handleSelectionOk,
    handlePromptChange,
    handleAccept,
    handleDiscard,
    handleEdit,
    handleDelete,
    hasEditingTicket,
  };
};
