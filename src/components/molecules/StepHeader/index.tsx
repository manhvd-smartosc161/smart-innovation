import React from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import { ActionBar } from "../ActionBar";
import "./index.scss";

interface StepHeaderProps {
  stepNumber: number;
  description: string;
  onDelete?: () => void;
  onCopy?: () => void;
  onSetting?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepNumber,
  description,
  onDelete,
  onCopy,
  onSetting,
  onComment,
  onEdit,
}) => {
  return (
    <div className="step-header">
      <div className="step-title">
        <span className="step-number">{stepNumber}</span>
        <PlayCircleOutlined className="step-icon" />
        <span className="step-description-text">{description}</span>
      </div>
      <ActionBar
        onDelete={onDelete}
        onCopy={onCopy}
        onSetting={onSetting}
        onComment={onComment}
        onEdit={onEdit}
      />
    </div>
  );
};

