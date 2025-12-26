import React from 'react';
import { Tabs } from 'antd';
import { MainLayout } from '@/components/templates';
import { TicketSidebar, TestTicketPanel } from '@/components/organisms';
import { WORKFLOW_TAB_KEYS, WORKFLOW_TAB_LABELS } from '@/constants';
import { AnalysisProvider } from '@/contexts';
import './index.scss';

const tabs = [
  { key: WORKFLOW_TAB_KEYS.DRAFTING, label: WORKFLOW_TAB_LABELS.DRAFTING },
  { key: WORKFLOW_TAB_KEYS.REVIEWING, label: WORKFLOW_TAB_LABELS.REVIEWING },
  { key: WORKFLOW_TAB_KEYS.CANCELLED, label: WORKFLOW_TAB_LABELS.CANCELLED },
  { key: WORKFLOW_TAB_KEYS.REJECTED, label: WORKFLOW_TAB_LABELS.REJECTED },
  { key: WORKFLOW_TAB_KEYS.RESOLVED, label: WORKFLOW_TAB_LABELS.RESOLVED },
  { key: WORKFLOW_TAB_KEYS.APPROVED, label: WORKFLOW_TAB_LABELS.APPROVED },
];

export const TestManagement: React.FC = () => {
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
    <AnalysisProvider>
      <MainLayout leftSidebar={<TicketSidebar />} tabs={tabsSection}>
        <TestTicketPanel />
      </MainLayout>
    </AnalysisProvider>
  );
};
