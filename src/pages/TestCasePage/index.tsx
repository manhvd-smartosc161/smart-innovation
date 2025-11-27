import React from 'react';
import { Tabs } from 'antd';
import { MainLayout } from '@/components/templates';
import { TicketSidebar, TestCasePanel } from '@/components/organisms';
import './index.scss';

const tabs = [
  { key: 'Drafting', label: 'Drafting' },
  { key: 'Reviewing', label: 'Reviewing' },
  { key: 'Cancelled', label: 'Cancelled' },
  { key: 'Rejected', label: 'Rejected' },
  { key: 'Resolved', label: 'Resolved' },
  { key: 'Approved', label: 'Approved' },
];

export const TestCaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>('Drafting');

  const tabsSection = (
    <div className="tabs-section">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabs}
        className="page-tabs"
      />
    </div>
  );

  return (
    <MainLayout leftSidebar={<TicketSidebar />} tabs={tabsSection}>
      <TestCasePanel />
    </MainLayout>
  );
};
