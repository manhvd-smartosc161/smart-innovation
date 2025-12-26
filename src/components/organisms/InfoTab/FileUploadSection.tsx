import React from 'react';
import { Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { FileUploadItem } from '@/components/molecules';
import type { FileType, UploadedFile } from '@/types';
import { INFO_TAB_LABELS, INFO_TAB_BUTTONS } from '@/constants';

interface FileUploadSectionProps {
  uploads: UploadedFile[];
  disabled?: boolean;
  hasEditingFile: boolean;
  onAdd: () => void;
  onFileTypeChange: (id: string, fileType: FileType) => void;
  onFileChange: (id: string, file: UploadFile | null) => void;
  onPromptChange: (id: string, prompt: string) => void;
  onAccept: (id: string) => void;
  onDiscard: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * FileUploadSection component
 *
 * Displays the file upload section in InfoTab
 */
export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  uploads,
  disabled = false,
  hasEditingFile,
  onAdd,
  onFileTypeChange,
  onFileChange,
  onPromptChange,
  onAccept,
  onDiscard,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <Divider />
      <div className="info-section">
        <div className="section-header">
          <h3>{INFO_TAB_LABELS.UPLOAD_FILES}</h3>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAdd}
            disabled={disabled || hasEditingFile}
          >
            {INFO_TAB_BUTTONS.ADD_UPLOAD}
          </Button>
        </div>
        <div className="section-content">
          {uploads.length === 0 ? (
            <div className="empty-message">
              No files uploaded yet. Click "Add Upload" to upload a file.
            </div>
          ) : (
            <div className="uploads-container">
              {uploads.map((upload) => {
                const isDisabled =
                  disabled || (hasEditingFile && !upload.isEditing);
                return (
                  <FileUploadItem
                    key={upload.id}
                    id={upload.id}
                    fileType={upload.fileType}
                    fileName={upload.file?.name || null}
                    prompt={upload.prompt}
                    isEditing={upload.isEditing}
                    isDisabled={isDisabled}
                    onFileTypeChange={onFileTypeChange}
                    onFileChange={onFileChange}
                    onPromptChange={onPromptChange}
                    onAccept={onAccept}
                    onDiscard={onDiscard}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
