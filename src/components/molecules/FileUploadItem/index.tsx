import React, { useState } from 'react';
import { Select, Upload, Input, Button, Tag, Tooltip, message } from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { FileType } from '@/types';
import { FILE_TYPES } from '@/types';
import { ALLOWED_FILES_DISPLAY, FILE_UPLOAD_ACCEPT } from '@/constants';
import { isValidFileType, truncateFileName } from '@/utils';
import './index.scss';

const { TextArea } = Input;

interface FileUploadItemProps {
  id: string;
  fileType: FileType;
  fileName: string | null;
  prompt: string;
  isEditing: boolean;
  isDisabled?: boolean;
  onFileTypeChange: (id: string, fileType: FileType) => void;
  onFileChange: (id: string, file: UploadFile | null) => void;
  onPromptChange: (id: string, prompt: string) => void;
  onAccept: (id: string) => void;
  onDiscard: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  id,
  fileType,
  fileName,
  prompt,
  isEditing,
  isDisabled = false,
  onFileTypeChange,
  onFileChange,
  onPromptChange,
  onAccept,
  onDiscard,
  onEdit,
  onDelete,
}) => {
  const [localFileType, setLocalFileType] = useState(fileType);
  const [localPrompt, setLocalPrompt] = useState(prompt);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    const validFiles = info.fileList.filter((file) => {
      if (file.originFileObj) {
        return isValidFileType(file.originFileObj);
      }
      return true;
    });

    if (validFiles.length < info.fileList.length) {
      message.error(
        `File type not allowed. Please upload only: ${ALLOWED_FILES_DISPLAY.join(', ')}`
      );
    }

    setFileList(validFiles);
    const file = validFiles.length > 0 ? validFiles[0] : null;
    onFileChange(id, file);
  };

  const handleBeforeUpload = (file: File) => {
    if (!isValidFileType(file)) {
      return false;
    }
    return false;
  };

  const handleRemove = () => {
    setFileList([]);
    onFileChange(id, null);
  };

  const handleAccept = () => {
    if (!fileList.length || !fileList[0]) {
      return;
    }
    if (!localPrompt || !localPrompt.trim()) {
      return;
    }
    onFileTypeChange(id, localFileType);
    onPromptChange(id, localPrompt);
    onAccept(id);
  };

  const handleDiscard = () => {
    setLocalFileType(fileType);
    setLocalPrompt(prompt);
    setFileList([]);
    onDiscard(id);
  };

  React.useEffect(() => {
    if (fileName && !fileList.length && isEditing) {
      setFileList([
        {
          uid: id,
          name: fileName,
          status: 'done',
        } as UploadFile,
      ]);
    }
  }, [fileName, id, fileList.length, isEditing]);

  const formattedFileList = React.useMemo(() => {
    return fileList.map((file) => ({
      ...file,
      name: truncateFileName(file.name, 40),
    }));
  }, [fileList]);

  const readonlyFileList = React.useMemo(() => {
    if (!fileName) return [];
    return [
      {
        uid: id,
        name: fileName,
        status: 'done',
      } as UploadFile,
    ];
  }, [fileName, id]);

  React.useEffect(() => {
    setLocalPrompt(prompt);
  }, [prompt]);

  React.useEffect(() => {
    setLocalFileType(fileType);
  }, [fileType]);

  if (isEditing) {
    return (
      <div
        className={`file-upload-item editing ${isDisabled ? 'disabled' : ''}`}
      >
        <div className="upload-header">
          <Select
            value={localFileType}
            onChange={setLocalFileType}
            className="type-select"
          >
            <Select.Option value={FILE_TYPES.BRD}>BRD</Select.Option>
            <Select.Option value={FILE_TYPES.TRD}>TRD</Select.Option>
            <Select.Option value={FILE_TYPES.OTHERS}>OTHERS</Select.Option>
          </Select>
          <div className="file-upload-wrapper">
            <Upload
              maxCount={1}
              fileList={formattedFileList}
              onChange={handleFileChange}
              onRemove={handleRemove}
              beforeUpload={handleBeforeUpload}
              accept={FILE_UPLOAD_ACCEPT}
            >
              {fileList.length === 0 && (
                <Button icon={<UploadOutlined />}>Select File</Button>
              )}
            </Upload>
            <Tooltip
              title={
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>
                    Allowed file types:
                  </div>
                  {ALLOWED_FILES_DISPLAY.map((type, index) => (
                    <div key={index}>{type}</div>
                  ))}
                </div>
              }
              placement="top"
            >
              <InfoCircleOutlined className="upload-info-icon" />
            </Tooltip>
          </div>
          <div className="upload-actions">
            <Button
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleAccept}
              disabled={
                !fileList.length ||
                !fileList[0] ||
                !localPrompt ||
                !localPrompt.trim()
              }
            />
            <Button icon={<CloseOutlined />} onClick={handleDiscard} />
          </div>
        </div>
        <TextArea
          rows={3}
          placeholder="Enter prompt to guide AI about this file..."
          value={localPrompt}
          onChange={(e) => setLocalPrompt(e.target.value)}
          className="upload-prompt"
        />
      </div>
    );
  }

  const handleEditClick = () => {
    if (!isDisabled) {
      onEdit(id);
    }
  };

  const handleDeleteClick = () => {
    if (!isDisabled) {
      onDelete(id);
    }
  };

  return (
    <div
      className={`file-upload-item readonly ${isDisabled ? 'disabled' : ''}`}
    >
      <div className="upload-header">
        <Tag color="blue" className="file-type-tag">
          {localFileType}
        </Tag>
        {fileName && (
          <div className="file-upload-wrapper">
            <Upload
              fileList={readonlyFileList}
              showUploadList={{
                showRemoveIcon: false,
              }}
            />
          </div>
        )}
        <div className="upload-actions">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={handleEditClick}
            disabled={isDisabled}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteClick}
            disabled={isDisabled}
          />
        </div>
      </div>
      {localPrompt && (
        <div className="upload-prompt-display">{localPrompt}</div>
      )}
    </div>
  );
};
