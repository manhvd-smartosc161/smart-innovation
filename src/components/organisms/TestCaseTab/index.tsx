import React from 'react';
import { TestCaseTree } from '../TestCaseTree';
import { DetailsForm } from '../DetailsForm';
import { StepsSection } from '../StepsSection';
import './index.scss';

export const TestCaseDetailTab: React.FC = () => {
  return (
    <div className="test-case-tab">
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
  );
};
