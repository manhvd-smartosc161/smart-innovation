import React from 'react';
import { Tabs } from 'antd';
import { MainLayout } from '@/components/templates';
import { Sidebar, DetailsForm, StepsSection } from '@/components/organisms';
import { Badge } from '@/components/atoms';
import './TestCaseDrafting.scss';

const tabs = [
  { key: 'Drafting', label: 'Drafting' },
  { key: 'Reviewing', label: 'Reviewing' },
  { key: 'Cancelled', label: 'Cancelled' },
  { key: 'Rejected', label: 'Rejected' },
  { key: 'Resolved', label: 'Resolved' },
  { key: 'Approved', label: 'Approved' },
];

export const TestCaseDrafting: React.FC = () => {
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

  const content = (
    <div className="content-area">
      <div className="content-header">
        <h1 className="content-title">Create order with invalid data</h1>
        <Badge>Scenario ID: OMS-0042</Badge>
      </div>

      <div className="main-card">
        <div className="content-section">
          <DetailsForm />
        </div>

        <div className="content-section">
          <div className="pre-condition-section">
            <h4 className="section-title">Pre Condition</h4>
            <div className="pre-condition-box">
              User is logged in. Product is in stock. Payment gateway is
              configured.
            </div>
          </div>
        </div>

        <div className="content-section">
          <StepsSection />
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout sidebar={<Sidebar />} tabs={tabsSection}>
      {content}
    </MainLayout>
  );
};
