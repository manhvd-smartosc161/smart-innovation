import React, { useState } from 'react';
import { Divider } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import { Button, AnimatedText } from '@/components/atoms';
import { FireworksAnimation } from '@/components/molecules';
import { Scope as Scope } from './Scope';
import { Impact } from './Impact';
import { useAnalysis } from '@/stores';
import { TAB_KEYS } from '@/constants';
import './index.scss';

const ScopeImpactTab: React.FC = () => {
  const { setIsChecklistGenerated, setActiveTab } = useAnalysis();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);

    // Simulate API call (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // End generating, show fireworks
    setIsGenerating(false);
    setShowFireworks(true);

    setTimeout(() => {
      setShowFireworks(false);
      setIsChecklistGenerated(true);
      setActiveTab(TAB_KEYS.CHECKLIST);
    }, 2000);
  };

  return (
    <div className="scope-impact-tab">
      {/* Fireworks Animation */}
      <FireworksAnimation show={showFireworks} />

      <div className="scope-impact-tab__header">
        <div className="generate-section">
          <div className="generate-icon-left">
            <FileDoneOutlined />
          </div>
          <div className="button-wrapper">
            <Button
              variant="primary"
              size="large"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`generate-button ${isGenerating ? 'is-generating' : ''}`}
            >
              {isGenerating ? (
                <AnimatedText
                  text="Generating..."
                  className="generating-text"
                />
              ) : (
                'Generate Checklist'
              )}
            </Button>
          </div>
          <div className="generate-icon-right">
            <FileDoneOutlined />
          </div>
        </div>
      </div>

      <Divider style={{ margin: 0, borderColor: 'rgba(0, 0, 0, 0.06)' }} />

      <div className="scope-impact-tab__content">
        <div className="scope-impact-tab__section">
          <Scope />
        </div>

        <Divider
          style={{ margin: '0 20px', borderColor: 'rgba(0, 0, 0, 0.06)' }}
        />

        <div className="scope-impact-tab__section">
          <Impact />
        </div>
      </div>
    </div>
  );
};

export default ScopeImpactTab;
