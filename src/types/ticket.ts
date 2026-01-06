export type TicketStatus =
  | 'Drafting'
  | 'Reviewing'
  | 'Cancelled'
  | 'Rejected'
  | 'Resolved'
  | 'Approved';

export interface Ticket {
  id: string;
  key: string;
  title: string;
  description?: string;
}

export interface ConfluencePage {
  id: string;
  url: string;
  title: string;
  pageUrl?: string; // For compatibility with fileUpload usage
  prompt?: string; // For compatibility with fileUpload usage
  isEditing?: boolean;
}
