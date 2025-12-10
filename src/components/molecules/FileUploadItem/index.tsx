import React from 'react';
import { Select, Upload, Input, Button } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import type { FileType } from '@/types';
import { FILE_TYPES } from '@/types';
import './index.scss';

const { TextArea } = Input;

interface FileUploadItemProps {
  id: string;
  fileType: FileType;
  prompt: string;
  onFileTypeChange: (id: string, fileType: FileType) => void;
  onFileChange: (id: string, file: UploadFile | null) => void;
  onPromptChange: (id: string, prompt: string) => void;
  onDelete: (id: string) => void;
}

export const FileUploadItem: React.FC<FileUploadItemProps> = ({
  id,
  fileType,
  prompt,
  onFileTypeChange,
  onFileChange,
  onPromptChange,
  onDelete,
}) => {
  const handleFileChange = (info: { fileList: UploadFile[] }) => {
    const file = info.fileList.length > 0 ? info.fileList[0] : null;
    onFileChange(id, file);
  };

  return (
    <div className="file-upload-item">
      <div className="upload-type">
        <Select
          value={fileType}
          onChange={(value) => onFileTypeChange(id, value as FileType)}
          className="type-select"
        >
          <Select.Option value={FILE_TYPES.BRD}>BRD</Select.Option>
          <Select.Option value={FILE_TYPES.TRD}>TRD</Select.Option>
          <Select.Option value={FILE_TYPES.OTHERS}>OTHERS</Select.Option>
        </Select>
      </div>
      <div className="upload-area">
        <Upload
          maxCount={1}
          onChange={handleFileChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>
      <div className="upload-prompt">
        <TextArea
          rows={3}
          placeholder="Enter prompt..."
          value={prompt}
          onChange={(e) => onPromptChange(id, e.target.value)}
        />
      </div>
      <div className="upload-actions">
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
