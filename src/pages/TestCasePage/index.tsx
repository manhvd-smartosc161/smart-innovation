import React from 'react';
import { Tabs } from 'antd';
import { MainLayout } from '@/components/templates';
import { TicketSidebar, TestCasePanel } from '@/components/organisms';
import { WORKFLOW_TAB_KEYS, WORKFLOW_TAB_LABELS } from '@/constants';
import './index.scss';

const tabs = [
  { key: WORKFLOW_TAB_KEYS.DRAFTING, label: WORKFLOW_TAB_LABELS.DRAFTING },
  { key: WORKFLOW_TAB_KEYS.REVIEWING, label: WORKFLOW_TAB_LABELS.REVIEWING },
  { key: WORKFLOW_TAB_KEYS.CANCELLED, label: WORKFLOW_TAB_LABELS.CANCELLED },
  { key: WORKFLOW_TAB_KEYS.REJECTED, label: WORKFLOW_TAB_LABELS.REJECTED },
  { key: WORKFLOW_TAB_KEYS.RESOLVED, label: WORKFLOW_TAB_LABELS.RESOLVED },
  { key: WORKFLOW_TAB_KEYS.APPROVED, label: WORKFLOW_TAB_LABELS.APPROVED },
];

export const TestCaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>(
    WORKFLOW_TAB_KEYS.DRAFTING
  );

  const tabsSection = (
    <div className="tabs-section">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
        className="page-tabs"
        tabBarGutter={16}
        moreIcon={null} // Optional: styling preference
      />
    </div>
  );

  return (
    <MainLayout leftSidebar={<TicketSidebar />} tabs={tabsSection}>
      <TestCasePanel />
    </MainLayout>
  );
};
