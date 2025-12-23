import React from 'react';
import { TestCaseTree } from '../TestCaseTree';
import { DetailsForm } from '../DetailsForm';
import { StepsSection } from '../StepsSection';
import './index.scss';

export const TestCaseDetailTab: React.FC = () => {
  return (
    <div className="test-case-tab">
      <div className="panel-left">
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
