import { useState } from 'react';
import type { UploadFile } from 'antd';
import type { FileType, UploadedFile } from '@/types';
import { FILE_TYPES } from '@/types';

/**
 * Custom hook for managing file uploads in InfoTab
 *
 * Handles all file upload operations including:
 * - Adding new uploads
 * - Editing file type and prompt
 * - Accepting/discarding changes
 * - Deleting uploads
 */
export const useFileUploadManagement = () => {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);

  const handleAdd = (defaultPrompt?: string) => {
    const hasEditingFile = uploads.some((upload) => upload.isEditing);
    if (hasEditingFile) {
      return;
    }

    const newUpload: UploadedFile = {
      id: Date.now().toString(),
      fileType: FILE_TYPES.BRD,
      file: null,
      prompt: defaultPrompt || '',
      isEditing: true,
    };
    setUploads([...uploads, newUpload]);
  };

  const handleFileTypeChange = (id: string, fileType: FileType) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, fileType } : upload
      )
    );
  };

  const handleFileChange = (id: string, file: UploadFile | null) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id
          ? { ...upload, file: file?.originFileObj || null }
          : upload
      )
    );
  };

  const handlePromptChange = (id: string, prompt: string) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, prompt } : upload
      )
    );
  };

  const handleAccept = (id: string) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, isEditing: false } : upload
      )
    );
  };

  const handleDiscard = (id: string) => {
    setUploads(uploads.filter((upload) => upload.id !== id));
  };

  const handleEdit = (id: string) => {
    const hasEditingFile = uploads.some((upload) => upload.isEditing);
    if (hasEditingFile) {
      return;
    }

    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, isEditing: true } : upload
      )
    );
  };

  const handleDelete = (id: string) => {
    setUploads(uploads.filter((upload) => upload.id !== id));
  };

  const hasEditingFile = uploads.some((upload) => upload.isEditing);

  return {
    uploads,
    setUploads,
    handleAdd,
    handleFileTypeChange,
    handleFileChange,
    handlePromptChange,
    handleAccept,
    handleDiscard,
    handleEdit,
    handleDelete,
    hasEditingFile,
  };
};
