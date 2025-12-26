import React from 'react';
import { TestCaseTree } from './TestCaseTree';
import { TestDetailsForm } from './TestDetailsForm';
import { TestStepsSection } from './TestStepsSection';
import './index.scss';

export const TestCaseDetailTab: React.FC = () => {
  return (
    <div className="test-case-tab">
      <div className="panel-left">
        <TestCaseTree />
      </div>
      <div className="panel-right">
        <TestDetailsForm />
        <div className="steps-wrapper">
          <TestStepsSection />
        </div>
      </div>
    </div>
  );
};
