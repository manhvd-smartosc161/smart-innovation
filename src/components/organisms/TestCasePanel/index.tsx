import React, { useState } from 'react';
import { Tabs } from 'antd';
import { TestCaseTree } from '../TestCaseTree';
import { DetailsForm } from '../DetailsForm';
import { StepsSection } from '../StepsSection';
import { InfoTab } from '../InfoTab';
import { TAB_KEYS, TAB_LABELS } from '@/constants';
import './index.scss';

const items = [
  { key: TAB_KEYS.INITIALIZATION, label: TAB_LABELS.INITIALIZATION },
  { key: TAB_KEYS.SCOPE, label: TAB_LABELS.SCOPE },
  { key: TAB_KEYS.IMPACT, label: TAB_LABELS.IMPACT },
  { key: TAB_KEYS.CHECKLIST, label: TAB_LABELS.CHECKLIST },
  { key: TAB_KEYS.TEST_CASES, label: TAB_LABELS.TEST_CASES },
  { key: TAB_KEYS.TEST_CASE_DETAILS, label: TAB_LABELS.TEST_CASE_DETAILS },
];

export const TestCasePanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(TAB_KEYS.INITIALIZATION);

  return (
    <div className="test-case-panel">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className="panel-tabs"
      />
      {activeTab === TAB_KEYS.INITIALIZATION ? (
        <InfoTab />
      ) : (
        <div className="panel-content">
          <div className="panel-left">
            <div className="tree-header">
              <span className="folder-icon">📂</span>
              <span className="root-name">JIRA_TICKET_001</span>
              <span className="more-options">...</span>
            </div>
            <TestCaseTree />
          </div>
          <div className="panel-right">
            <DetailsForm />
            <div className="steps-wrapper">
              <StepsSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
