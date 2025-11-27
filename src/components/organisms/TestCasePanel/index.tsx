import React from 'react';
import { Tabs } from 'antd';
import { TestCaseTree } from '../TestCaseTree';
import { DetailsForm } from '../DetailsForm';
import { StepsSection } from '../StepsSection';
import './index.scss';

const items = [
  { key: 'Info', label: 'Info' },
  { key: 'Scope', label: 'Scope' },
  { key: 'Impact', label: 'Impact' },
  { key: 'Checklist', label: 'Checklist' },
  { key: 'Test Cases', label: 'Test Cases' },
  { key: 'Test Case Details', label: 'Test Case Details' },
];

export const TestCasePanel: React.FC = () => {
  return (
    <div className="test-case-panel">
      <Tabs defaultActiveKey="Info" items={items} className="panel-tabs" />
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
    </div>
  );
};
