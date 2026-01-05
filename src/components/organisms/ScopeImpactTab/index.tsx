import React, { useState, useRef } from 'react';
import { Divider, message } from 'antd';
import { FileDoneOutlined } from '@ant-design/icons';
import { Button, AnimatedText } from '@/components/atoms';
import { FireworksAnimation, SaveSection } from '@/components/molecules';
import { Scope as Scope } from './Scope';
import { Impact } from './Impact';
import { useAnalysis } from '@/stores';
import { TAB_KEYS } from '@/constants';
import type { ScopeItem, ImpactItem } from '@/types';
import './index.scss';

const ScopeImpactTab: React.FC = () => {
  const { setIsChecklistGenerated, setActiveTab } = useAnalysis();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  // Read-only mode state
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for Scope and Impact data
  const [scopeData, setScopeData] = useState<ScopeItem[]>([]);
  const [impactData, setImpactData] = useState<ImpactItem[]>([]);

  // Refs to access save functions
  const scopeRef = useRef<{ save: () => void }>(null);
  const impactRef = useRef<{ save: () => void }>(null);

  // Saved state for cancel functionality
  const [savedState, setSavedState] = useState({
    scopeData: [] as ScopeItem[],
    impactData: [] as ImpactItem[],
  });

  const handleEdit = () => {
    // Save current state before editing
    setSavedState({
      scopeData: JSON.parse(JSON.stringify(scopeData)),
      impactData: JSON.parse(JSON.stringify(impactData)),
    });
    setIsReadOnly(false);
  };

  const handleSave = async () => {
    // Check if there are any changes
    const hasChanges =
      JSON.stringify(scopeData) !== JSON.stringify(savedState.scopeData) ||
      JSON.stringify(impactData) !== JSON.stringify(savedState.impactData);

    if (!hasChanges) {
      // No changes, just return to read-only mode
      setIsReadOnly(true);
      message.info('No changes to save');
      return;
    }

    setIsSaving(true);

    // Call save functions from both tables to trigger history and highlight
    scopeRef.current?.save();
    impactRef.current?.save();

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save the current state
    setSavedState({
      scopeData: JSON.parse(JSON.stringify(scopeData)),
      impactData: JSON.parse(JSON.stringify(impactData)),
    });

    setIsReadOnly(true);
    setIsSaving(false);
    message.success('Changes saved successfully!');
  };

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

  // Validation for Save button
  const isSaveDisabled = isSaving;

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
              disabled={isGenerating || !isReadOnly}
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

          {/* Edit/Save Button */}
          <SaveSection
            isReadOnly={isReadOnly}
            isSaving={isSaving}
            isSaveDisabled={isSaveDisabled}
            onEdit={handleEdit}
            onSave={handleSave}
            className="scope-impact-save-section"
          />
        </div>
      </div>

      <Divider style={{ margin: 0, borderColor: 'rgba(0, 0, 0, 0.06)' }} />

      <div className="scope-impact-tab__content">
        <div className="scope-impact-tab__section">
          <Scope
            disabled={isReadOnly || isSaving}
            onDataChange={setScopeData}
            onSaveRef={scopeRef}
          />
        </div>

        <Divider
          style={{ margin: '0 20px', borderColor: 'rgba(0, 0, 0, 0.06)' }}
        />

        <div className="scope-impact-tab__section">
          <Impact
            disabled={isReadOnly || isSaving}
            onDataChange={setImpactData}
            onSaveRef={impactRef}
          />
        </div>
      </div>
    </div>
  );
};

export default ScopeImpactTab;
