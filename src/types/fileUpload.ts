import type { ConfluencePage } from './ticket';

export type FileType = 'BRD' | 'TRD' | 'OTHERS';

export const FILE_TYPES = {
  BRD: 'BRD' as FileType,
  TRD: 'TRD' as FileType,
  OTHERS: 'OTHERS' as FileType,
};

export interface UploadedFile {
  id: string;
  fileType: FileType;
  file: File | null;
  prompt: string;
  isEditing: boolean;
}

export interface RelatedTicket {
  id: string;
  ticketId: string;
  ticketTitle?: string;
  prompt: string;
  isEditing?: boolean;
}

export interface AnalysisData {
  files: UploadedFile[];
  tickets: RelatedTicket[];
  confluencePages: ConfluencePage[];
  overallObjective: string;
}
