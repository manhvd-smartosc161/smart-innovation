import React, { lazy, Suspense, useEffect } from 'react';
import { Tabs, Modal, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

// Lazy load tab components for code splitting
const InfoTab = lazy(() => import('@/components/organisms/InfoTab'));
const ScopeImpactTab = lazy(
  () => import('@/components/organisms/ScopeImpactTab')
);
const ChecklistTab = lazy(() => import('@/components/organisms/ChecklistTab'));
const TestCaseTab = lazy(() => import('@/components/organisms/TestCaseTab'));
const TestCaseDetailTab = lazy(
  () => import('@/components/organisms/TestCaseDetailTab')
);

import { TAB_KEYS, TAB_LABELS, WORKFLOW_TAB_KEYS } from '@/constants';
import { useAnalysis } from '@/stores';
import './index.scss';

const allItems = [
  { key: TAB_KEYS.INITIALIZATION, label: TAB_LABELS.INITIALIZATION },
  { key: TAB_KEYS.SCOPE_AND_IMPACT, label: TAB_LABELS.SCOPE_AND_IMPACT },
  { key: TAB_KEYS.CHECKLIST, label: TAB_LABELS.CHECKLIST },
  { key: TAB_KEYS.TEST_CASES, label: TAB_LABELS.TEST_CASES },
  { key: TAB_KEYS.TEST_CASE_DETAILS, label: TAB_LABELS.TEST_CASE_DETAILS },
];

// Loading fallback component
const TabLoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    }}
  >
    <Spin size="large" tip="Loading..." />
  </div>
);

export const TestTicketPanel: React.FC<{ workflowStatus: string }> = ({
  workflowStatus,
}) => {
  const {
    isAnalysed,
    isChecklistGenerated,
    isTestCasesGenerated,
    activeTab,
    setActiveTab,
    hasUnsavedChanges,
    selectedTestCaseId,
  } = useAnalysis();

  // Reset analysis steps when switching workflow tabs
  /* 
  // Commented out to prevent resetting state when switching tabs for now
  // Can be enabled if we want strict separation between workflow states
  useEffect(() => {
    setActiveTab(TAB_KEYS.INITIALIZATION);
  }, [workflowStatus, setActiveTab]); 
  */

  const isActionHidden = workflowStatus === WORKFLOW_TAB_KEYS.APPROVED;

  useEffect(() => {
    if (!activeTab) {
      setActiveTab(TAB_KEYS.INITIALIZATION);
    }
  }, [activeTab, setActiveTab]);

  const items = allItems.filter((item) => {
    if (item.key === TAB_KEYS.INITIALIZATION) return true;
    if (item.key === TAB_KEYS.SCOPE_AND_IMPACT) return isAnalysed;
    if (item.key === TAB_KEYS.CHECKLIST)
      return isAnalysed && isChecklistGenerated;
    if (item.key === TAB_KEYS.TEST_CASES)
      return isAnalysed && isChecklistGenerated && isTestCasesGenerated;
    if (item.key === TAB_KEYS.TEST_CASE_DETAILS)
      return (
        isAnalysed &&
        isChecklistGenerated &&
        isTestCasesGenerated &&
        selectedTestCaseId !== null
      );
    return false;
  });

  const handleTabChange = (newTab: string) => {
    // Check for unsaved changes
    const unsavedItems: string[] = [];

    if (activeTab === TAB_KEYS.SCOPE_AND_IMPACT) {
      if (hasUnsavedChanges('Scope')) unsavedItems.push('Scope');
      if (hasUnsavedChanges('Impact')) unsavedItems.push('Impact');
      // Fallback if generic analyse change is set but not specific tables
      if (
        unsavedItems.length === 0 &&
        hasUnsavedChanges(TAB_KEYS.SCOPE_AND_IMPACT)
      ) {
        unsavedItems.push('Scope & Impact');
      }
    } else if (activeTab && hasUnsavedChanges(activeTab)) {
      const tabLabel =
        allItems.find((item) => item.key === activeTab)?.label || 'Current Tab';
      unsavedItems.push(String(tabLabel));
    }

    if (unsavedItems.length > 0) {
      const itemsText = unsavedItems.join(' and ');
      // Show confirmation modal
      Modal.confirm({
        title: 'Unsaved Changes',
        icon: <ExclamationCircleOutlined />,
        content: `You have unsaved changes in ${itemsText}. Are you sure you want to leave? Your changes will be lost.`,
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
      <Suspense fallback={<TabLoadingFallback />}>
        <div
          style={{
            display: activeTab === TAB_KEYS.INITIALIZATION ? 'block' : 'none',
          }}
        >
          <InfoTab isActionHidden={isActionHidden} />
        </div>
        <div
          style={{
            display: activeTab === TAB_KEYS.SCOPE_AND_IMPACT ? 'block' : 'none',
          }}
        >
          <ScopeImpactTab isActionHidden={isActionHidden} />
        </div>
        <div
          style={{
            display: activeTab === TAB_KEYS.CHECKLIST ? 'block' : 'none',
          }}
        >
          <ChecklistTab isActionHidden={isActionHidden} />
        </div>
        <div
          style={{
            display: activeTab === TAB_KEYS.TEST_CASES ? 'block' : 'none',
          }}
        >
          <TestCaseTab isActionHidden={isActionHidden} />
        </div>
        <div
          style={{
            display:
              activeTab === TAB_KEYS.TEST_CASE_DETAILS ? 'block' : 'none',
          }}
        >
          <TestCaseDetailTab isActionHidden={isActionHidden} />
        </div>
      </Suspense>
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
