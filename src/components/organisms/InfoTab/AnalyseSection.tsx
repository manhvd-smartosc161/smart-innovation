import React from 'react';
import { Button, Tooltip, Progress } from 'antd';
import {
  ThunderboltOutlined,
  RocketOutlined,
  EditOutlined,
  SaveOutlined,
} from '@ant-design/icons';
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
      {showFireworks && (
        <div className="fireworks-container">
          <div className="firework firework-1"></div>
          <div className="firework firework-2"></div>
          <div className="firework firework-3"></div>
          <div className="firework firework-4"></div>
          <div className="firework firework-5"></div>
          <div className="firework firework-6"></div>
          <div className="firework firework-7"></div>
          <div className="firework firework-8"></div>
          <div className="firework firework-9"></div>
          <div className="firework firework-10"></div>
          <div className="firework firework-11"></div>
          <div className="firework firework-12"></div>
        </div>
      )}

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
                type="primary"
                size="large"
                onClick={onAnalyse}
                disabled={isAnalyseDisabled || isAnalysing}
                className="analyse-button"
              >
                {isAnalysing ? (
                  <span className="analysing-text">
                    {'Analysing...'.split('').map((char, index) => (
                      <span key={index}>{char}</span>
                    ))}
                  </span>
                ) : (
                  INFO_TAB_LABELS.ANALYSE
                )}
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            type="primary"
            size="large"
            onClick={onAnalyse}
            disabled={isAnalyseDisabled || isAnalysing}
            className="analyse-button"
          >
            {isAnalysing ? (
              <span className="analysing-text">
                {'Analysing...'.split('').map((char, index) => (
                  <span key={index}>{char}</span>
                ))}
              </span>
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
              type="primary"
              shape="circle"
              size="large"
              icon={<EditOutlined />}
              onClick={onEdit}
              disabled={showFireworks}
              className="section-edit-button"
            />
          ) : (
            <Button
              type="primary"
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
