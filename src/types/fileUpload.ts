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
}

export interface RelatedTicket {
  id: string;
  ticketId: string;
  ticketTitle?: string;
  prompt: string;
}

export interface ConfluencePage {
  id: string;
  pageUrl: string;
  pageTitle?: string;
  prompt: string;
}

export interface AnalysisData {
  files: UploadedFile[];
  tickets: RelatedTicket[];
  confluencePages: ConfluencePage[];
  overallObjective: string;
}
