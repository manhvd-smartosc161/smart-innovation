import React, { useState } from 'react';
import { TestCaseTree } from './TestCaseTree';
import { TestDetailsForm } from './TestDetailsForm';
import { TestStepsSection } from './TestStepsSection';
import './index.scss';

export const TestCaseDetailTab: React.FC = () => {
  const [showSteps, setShowSteps] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const handleAIGeneration = () => {
    // Start generating animation and show sparkles immediately
    setIsGenerating(true);
    setShowSparkles(true);

    // After 2 seconds, stop generating and hide sparkles
    setTimeout(() => {
      setIsGenerating(false);
      setShowSparkles(false);
      // Show steps immediately after sparkles disappear
      setShowSteps(true);
    }, 2000);
  };

  return (
    <div className="test-case-detail-tab">
      <div className="test-case-detail-content">
        <div className="test-case-detail-left">
          <TestCaseTree />
        </div>
        <div className="test-case-detail-right">
          <TestDetailsForm
            onAIGeneration={handleAIGeneration}
            isGenerating={isGenerating}
            showSparkles={showSparkles}
          />
          {showSteps && (
            <div className="steps-reveal-animation">
              <TestStepsSection />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
