import React, { useEffect } from 'react';
import { Tabs } from 'antd';

import {
  InfoTab,
  ScopeTab,
  ImpactTab,
  ChecklistTab,
  TestCaseDetailTab,
} from '@/components/organisms';
import { TAB_KEYS, TAB_LABELS } from '@/constants';
import { useAnalysis } from '@/contexts';
import './index.scss';

const allItems = [
  { key: TAB_KEYS.INITIALIZATION, label: TAB_LABELS.INITIALIZATION },
  { key: TAB_KEYS.SCOPE, label: TAB_LABELS.SCOPE },
  { key: TAB_KEYS.IMPACT, label: TAB_LABELS.IMPACT },
  { key: TAB_KEYS.CHECKLIST, label: TAB_LABELS.CHECKLIST },
  { key: TAB_KEYS.TEST_CASES, label: TAB_LABELS.TEST_CASES },
  { key: TAB_KEYS.TEST_CASE_DETAILS, label: TAB_LABELS.TEST_CASE_DETAILS },
];

export const TestCasePanel: React.FC = () => {
  const { isAnalysed, activeTab, setActiveTab } = useAnalysis();

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(TAB_KEYS.INITIALIZATION);
    }
  }, [activeTab, setActiveTab]);

  const items = isAnalysed
    ? allItems
    : allItems.filter((item) => item.key === TAB_KEYS.INITIALIZATION);

  const renderContent = () => {
    switch (activeTab) {
      case TAB_KEYS.INITIALIZATION:
        return <InfoTab />;
      case TAB_KEYS.SCOPE:
        return <ScopeTab />;
      case TAB_KEYS.IMPACT:
        return <ImpactTab />;
      case TAB_KEYS.CHECKLIST:
        return <ChecklistTab />;
      case TAB_KEYS.TEST_CASES:
      case TAB_KEYS.TEST_CASE_DETAILS:
      default:
        return <TestCaseDetailTab />;
    }
  };

  return (
    <div className="test-case-panel">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        className="panel-tabs"
      />
      {renderContent()}
    </div>
  );
};
