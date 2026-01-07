import React from 'react';
import { MainLayout } from '@/components/templates';
import { TicketSidebar, TestTicketPanel } from '@/components/organisms';
import { WORKFLOW_TAB_KEYS } from '@/constants';
import './index.scss';

export const TestManagement: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>(
    WORKFLOW_TAB_KEYS.DRAFTING
  );

  return (
    <MainLayout
      leftSidebar={
        <TicketSidebar activeTab={activeTab} onStatusChange={setActiveTab} />
      }
      tabs={null}
    >
      <TestTicketPanel workflowStatus={activeTab} />
    </MainLayout>
  );
};
