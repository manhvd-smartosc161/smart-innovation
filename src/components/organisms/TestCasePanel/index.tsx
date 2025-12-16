import React, { useEffect } from 'react';
import { Tabs, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

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
  const { isAnalysed, activeTab, setActiveTab, hasUnsavedChanges } =
    useAnalysis();

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(TAB_KEYS.INITIALIZATION);
    }
  }, [activeTab, setActiveTab]);

  const items = isAnalysed
    ? allItems
    : allItems.filter((item) => item.key === TAB_KEYS.INITIALIZATION);

  const handleTabChange = (newTab: string) => {
    // Check if current tab has unsaved changes
    if (activeTab && hasUnsavedChanges(activeTab)) {
      // Show confirmation modal
      Modal.confirm({
        title: 'Unsaved Changes',
        icon: <ExclamationCircleOutlined />,
        content:
          'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
        okText: 'Leave without saving',
        okType: 'danger',
        cancelText: 'Stay on page',
        onOk: () => {
          // User chose to leave - just switch tab (keep unsaved flag)
          setActiveTab(newTab);
        },
      });
    } else {
      // No unsaved changes - switch tab directly
      setActiveTab(newTab);
    }
  };

  const renderContent = () => {
    return (
      <>
        <div
          style={{
            display: activeTab === TAB_KEYS.INITIALIZATION ? 'block' : 'none',
          }}
        >
          <InfoTab />
        </div>
        <div
          style={{ display: activeTab === TAB_KEYS.SCOPE ? 'block' : 'none' }}
        >
          <ScopeTab />
        </div>
        <div
          style={{ display: activeTab === TAB_KEYS.IMPACT ? 'block' : 'none' }}
        >
          <ImpactTab />
        </div>
        <div
          style={{
            display: activeTab === TAB_KEYS.CHECKLIST ? 'block' : 'none',
          }}
        >
          <ChecklistTab />
        </div>
        <div
          style={{
            display:
              activeTab === TAB_KEYS.TEST_CASES ||
              activeTab === TAB_KEYS.TEST_CASE_DETAILS
                ? 'block'
                : 'none',
          }}
        >
          <TestCaseDetailTab />
        </div>
      </>
    );
  };

  return (
    <div className="test-case-panel">
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        items={items}
        className="panel-tabs"
      />
      {renderContent()}
    </div>
  );
};
