import React, { useState } from 'react';
import { Button, Divider } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import { Scope } from './Scope';
import { Impact } from './Impact';
import { useAnalysis } from '@/contexts';
import { TAB_KEYS } from '@/constants';
import './index.scss';

export const ScopeImpactTab: React.FC = () => {
  const { setIsChecklistGenerated, setActiveTab } = useAnalysis();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlyingChecklist, setShowFlyingChecklist] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setShowFlyingChecklist(true);

    setTimeout(() => {
      setShowFlyingChecklist(false);
      setShowFireworks(true);
    }, 1500);

    setTimeout(() => {
      setShowFireworks(false);
      setIsGenerating(false);
      setIsChecklistGenerated(true);
      setActiveTab(TAB_KEYS.CHECKLIST);
    }, 3500);
  };

  return (
    <div className="scope-impact-tab">
      {/* Flying Checklist Animation */}
      {showFlyingChecklist && (
        <div className="flying-checklist-container">
          <div className="flying-checklist">📋</div>
        </div>
      )}

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
              className={`generate-button ${isGenerating ? 'is-generating' : ''}`}
            >
              Generate Checklist
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
