import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
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
      {showFireworks && (
        <div className="fireworks-container">
          <div className="firework firework-1"></div>
          <div className="firework firework-2"></div>
          <div className="firework firework-3"></div>
          <div className="firework firework-4"></div>
          <div className="firework firework-5"></div>
          <div className="firework firework-6"></div>
          <div className="firework firework-7"></div>
          <div className="firework firework-8"></div>
          <div className="firework firework-9"></div>
          <div className="firework firework-10"></div>
          <div className="firework firework-11"></div>
          <div className="firework firework-12"></div>
        </div>
      )}

      <div className="scope-impact-tab__header">
        <div className="generate-section">
          <div className="generate-icon-left">
            <FileDoneOutlined />
          </div>
          <div className="button-wrapper">
            <Button
              type="primary"
              size="large"
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`generate-button ${isGenerating ? 'is-generating' : ''}`}
            >
              {isGenerating ? (
                <span className="generating-text">
                  {'Generating...'.split('').map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </span>
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
