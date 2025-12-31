import React from 'react';
import { Tooltip, Progress } from 'antd';
import {
  ThunderboltOutlined,
  RocketOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Button, AnimatedText } from '@/components/atoms';
import { FireworksAnimation } from '@/components/molecules';
import { INFO_TAB_LABELS } from '@/constants';

interface AnalyseSectionProps {
  // Analysis state
  isAnalysing: boolean;
  showFireworks: boolean;
  isAnalyseDisabled: boolean;
  analyseTooltip: string;
  onAnalyse: () => void;

  // Edit/Save state
  isReadOnly: boolean;
  isSaving: boolean;
  isSaveDisabled: boolean;
  onEdit: () => void;
  onSave: () => void;
}

/**
 * AnalyseSection component
 *
 * Displays the sticky analyse button section with fireworks animation,
 * edit/save buttons, and progress bar
 */
export const AnalyseSection: React.FC<AnalyseSectionProps> = ({
  isAnalysing,
  showFireworks,
  isAnalyseDisabled,
  analyseTooltip,
  onAnalyse,
  isReadOnly,
  isSaving,
  isSaveDisabled,
  onEdit,
  onSave,
}) => {
  return (
    <>
      {/* Fireworks Animation */}
      <FireworksAnimation show={showFireworks} />

      {/* Analyse Button - Sticky */}
      <div className="analyse-section">
        <div className="analyse-icon-left">
          <ThunderboltOutlined />
        </div>
        {analyseTooltip ? (
          <Tooltip
            title={
              <div style={{ whiteSpace: 'pre-line' }}>{analyseTooltip}</div>
            }
            placement="bottom"
          >
            <span>
              <Button
                variant="primary"
                size="large"
                onClick={onAnalyse}
                disabled={isAnalyseDisabled || isAnalysing}
                className="analyse-button"
              >
                {isAnalysing ? (
                  <AnimatedText
                    text="Analysing..."
                    className="analysing-text"
                  />
                ) : (
                  INFO_TAB_LABELS.ANALYSE
                )}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            variant="primary"
            size="large"
            onClick={onAnalyse}
            disabled={isAnalyseDisabled || isAnalysing}
            className="analyse-button"
          >
            {isAnalysing ? (
              <AnimatedText text="Analysing..." className="analysing-text" />
            ) : (
              INFO_TAB_LABELS.ANALYSE
            )}
          </Button>
        )}
        <div className="analyse-icon-right">
          <RocketOutlined />
        </div>

        {/* Edit/Save Button inside section */}
        <Tooltip
          title={
            isReadOnly
              ? showFireworks
                ? 'Analysing...'
                : 'Edit Mode'
              : isSaving
                ? 'Saving...'
                : 'Save Changes'
          }
          placement="left"
        >
          {isReadOnly ? (
            <Button
              variant="primary"
              shape="circle"
              size="large"
              icon={<EditOutlined />}
              onClick={onEdit}
              disabled={showFireworks}
              className="section-edit-button"
            />
          ) : (
            <Button
              variant="primary"
              shape="circle"
              size="large"
              icon={<SaveOutlined />}
              onClick={onSave}
              loading={isSaving}
              disabled={isSaveDisabled}
              className="section-save-button"
            />
          )}
        </Tooltip>

        {/* Progress Bar for Saving */}
        {isSaving && (
          <div className="saving-progress">
            <Progress
              percent={0}
              size="small"
              status="active"
              strokeColor={{
                '0%': '#722ed1',
                '100%': '#531dab',
              }}
              showInfo={false}
            />
          </div>
        )}
      </div>
    </>
  );
};
