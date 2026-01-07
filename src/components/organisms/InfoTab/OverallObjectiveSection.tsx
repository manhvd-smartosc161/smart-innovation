import React from 'react';
import { Divider } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { TextArea } from '@/components/atoms';
import { INFO_TAB_LABELS } from '@/constants';

interface OverallObjectiveSectionProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/**
 * OverallObjectiveSection component
 *
 * Displays the overall objective input section in InfoTab
 */
export const OverallObjectiveSection: React.FC<
  OverallObjectiveSectionProps
> = ({ value, onChange, disabled = false }) => {
  return (
    <>
      <Divider />
      <div className="info-section">
        <div className="section-header">
          <h3>
            <AimOutlined />
            {INFO_TAB_LABELS.OVERALL_OBJECTIVE}
          </h3>
        </div>
        <div className="section-content">
          <TextArea
            rows={4}
            placeholder="Enter the overall objective description for this test ticket..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="overall-objective-input"
            disabled={disabled}
          />
        </div>
      </div>
    </>
  );
};
