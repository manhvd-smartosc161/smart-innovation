import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import type { AnalysisData } from '@/types';
import { TAB_KEYS } from '@/constants';
import { useAnalysis } from '@/stores';
import {
  useFileUploadManagement,
  useTicketManagement,
  useConfluencePageManagement,
} from '@/hooks';
import { AnalyseSection } from './AnalyseSection';
import { OverallObjectiveSection } from './OverallObjectiveSection';
import { FileUploadSection } from './FileUploadSection';
import { TicketsSection } from './TicketsSection';
import { PagesSection } from './PagesSection';
import { TicketSelectionModal } from './TicketSelectionModal';
import { PageSelectionModal } from './PageSelectionModal';
import './index.scss';

interface InfoTabProps {
  isActionHidden?: boolean;
}

const InfoTab: React.FC<InfoTabProps> = ({ isActionHidden }) => {
  const { setIsAnalysed, setActiveTab } = useAnalysis();
  const [overallObjective, setOverallObjective] = useState<string>('');

  // Use custom hooks for managing different sections
  const fileUpload = useFileUploadManagement();
  const ticketMgmt = useTicketManagement();
  const pageMgmt = useConfluencePageManagement();

  // Read-only mode state
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Saved state for cancel functionality
  const [savedState, setSavedState] = useState({
    uploads: [] as typeof fileUpload.uploads,
    tickets: [] as typeof ticketMgmt.tickets,
    confluencePages: [] as typeof pageMgmt.pages,
    overallObjective: '',
  });

  // Prompt examples state
  const [promptExamples, setPromptExamples] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    fetch('/prompt-examples.json')
      .then((res) => res.json())
      .then((data) => setPromptExamples(data))
      .catch((err) => console.error('Failed to load prompt examples:', err));
  }, []);

  // Analysis state
  const [showFireworks, setShowFireworks] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);

  const handleEdit = () => {
    // Save current state before editing
    setSavedState({
      uploads: JSON.parse(JSON.stringify(fileUpload.uploads)),
      tickets: JSON.parse(JSON.stringify(ticketMgmt.tickets)),
      confluencePages: JSON.parse(JSON.stringify(pageMgmt.pages)),
      overallObjective,
    });
    setIsReadOnly(false);
  };

  const handleSave = async () => {
    // Check if there are any changes
    const hasChanges =
      JSON.stringify(fileUpload.uploads) !==
        JSON.stringify(savedState.uploads) ||
      JSON.stringify(ticketMgmt.tickets) !==
        JSON.stringify(savedState.tickets) ||
      JSON.stringify(pageMgmt.pages) !==
        JSON.stringify(savedState.confluencePages) ||
      overallObjective !== savedState.overallObjective;

    if (!hasChanges) {
      // No changes, just return to read-only mode
      setIsReadOnly(true);
      message.info('No changes to save');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Save the current state
    setSavedState({
      uploads: JSON.parse(JSON.stringify(fileUpload.uploads)),
      tickets: JSON.parse(JSON.stringify(ticketMgmt.tickets)),
      confluencePages: JSON.parse(JSON.stringify(pageMgmt.pages)),
      overallObjective,
    });

    setIsReadOnly(true);
    setIsSaving(false);
    message.success('Changes saved successfully!');
  };

  const handleAnalyse = async () => {
    const analysisData: AnalysisData = {
      files: fileUpload.uploads,
      tickets: ticketMgmt.tickets,
      confluencePages: pageMgmt.pages,
      overallObjective,
    };

    console.log('Analysis Data:', analysisData);

    // Start analysing state
    setIsAnalysing(true);

    // Simulate API call (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // End analysing, show fireworks directly
    setIsAnalysing(false);
    setShowFireworks(true);

    setTimeout(() => {
      setShowFireworks(false);
      setIsAnalysed(true);
      setActiveTab(TAB_KEYS.SCOPE_AND_IMPACT);
    }, 2000);

    // TODO: Add real API call here
  };

  // Validation for Analyse button
  const isAnalyseDisabled =
    !isReadOnly ||
    !overallObjective.trim() ||
    fileUpload.uploads.filter((upload) => upload.file).length === 0 || // At least one file must be uploaded
    fileUpload.hasEditingFile ||
    ticketMgmt.hasEditingTicket ||
    pageMgmt.hasEditingPage;

  // Generate tooltip message for Analyse button
  const getAnalyseTooltip = (): string => {
    if (!isReadOnly) return 'Saving, please wait...';
    if (!isAnalyseDisabled) return '';

    const reasons: string[] = [];

    if (!overallObjective.trim()) {
      reasons.push('Please enter the Overall Objective');
    }

    if (fileUpload.uploads.filter((upload) => upload.file).length === 0) {
      reasons.push('Please upload at least one file');
    }

    if (fileUpload.hasEditingFile) {
      reasons.push('Please save or discard file uploads being edited');
    }

    if (ticketMgmt.hasEditingTicket) {
      reasons.push('Please save or discard tickets being edited');
    }

    if (pageMgmt.hasEditingPage) {
      reasons.push('Please save or discard confluence pages being edited');
    }

    // Only add bullet points if there are 2 or more errors
    if (reasons.length >= 2) {
      return reasons.map((reason) => `• ${reason}`).join('\n');
    }

    return reasons[0] || '';
  };

  // Validation for Save button - simpler
  const isSaveDisabled =
    fileUpload.hasEditingFile ||
    ticketMgmt.hasEditingTicket ||
    pageMgmt.hasEditingPage ||
    isSaving;

  return (
    <div className="info-tab">
      {!isActionHidden && (
        <AnalyseSection
          isAnalysing={isAnalysing}
          showFireworks={showFireworks}
          isAnalyseDisabled={isAnalyseDisabled}
          analyseTooltip={getAnalyseTooltip()}
          onAnalyse={handleAnalyse}
          isReadOnly={isReadOnly}
          isSaving={isSaving}
          isSaveDisabled={isSaveDisabled}
          onEdit={handleEdit}
          onSave={handleSave}
        />
      )}

      {/* Scrollable Content */}
      <div className="info-tab-content">
        <OverallObjectiveSection
          value={overallObjective}
          onChange={setOverallObjective}
          disabled={isReadOnly || isSaving}
        />

        <FileUploadSection
          uploads={fileUpload.uploads}
          disabled={isReadOnly || isSaving}
          hasEditingFile={fileUpload.hasEditingFile}
          onAdd={() => fileUpload.handleAdd(promptExamples['BRD'])}
          onFileTypeChange={fileUpload.handleFileTypeChange}
          onFileChange={fileUpload.handleFileChange}
          onPromptChange={fileUpload.handlePromptChange}
          onAccept={fileUpload.handleAccept}
          onDiscard={fileUpload.handleDiscard}
          onEdit={fileUpload.handleEdit}
          onDelete={fileUpload.handleDelete}
          promptExamples={promptExamples}
        />

        <TicketsSection
          tickets={ticketMgmt.tickets}
          disabled={isReadOnly || isSaving}
          hasEditingTicket={ticketMgmt.hasEditingTicket}
          onOpenModal={() => ticketMgmt.setModalVisible(true)}
          onPromptChange={ticketMgmt.handlePromptChange}
          onAccept={ticketMgmt.handleAccept}
          onDiscard={ticketMgmt.handleDiscard}
          onEdit={ticketMgmt.handleEdit}
          onDelete={ticketMgmt.handleDelete}
          promptExamples={promptExamples}
        />

        <PagesSection
          pages={pageMgmt.pages}
          disabled={isReadOnly || isSaving}
          hasEditingPage={pageMgmt.hasEditingPage}
          onOpenModal={() => pageMgmt.setModalVisible(true)}
          onPromptChange={pageMgmt.handlePromptChange}
          onAccept={pageMgmt.handleAccept}
          onDiscard={pageMgmt.handleDiscard}
          onEdit={pageMgmt.handleEdit}
          onDelete={pageMgmt.handleDelete}
          promptExamples={promptExamples}
        />
      </div>

      {/* Modals */}
      <TicketSelectionModal
        visible={ticketMgmt.modalVisible}
        selectedTicketIds={ticketMgmt.tickets.map((t) => t.ticketId)}
        onOk={(ids) =>
          ticketMgmt.handleSelectionOk(ids, promptExamples['Ticket'])
        }
        onCancel={() => ticketMgmt.setModalVisible(false)}
      />
      <PageSelectionModal
        visible={pageMgmt.modalVisible}
        selectedPageUrls={pageMgmt.pages.map((p) => p.url)}
        onOk={(urls) =>
          pageMgmt.handleSelectionOk(urls, promptExamples['Confluence Page'])
        }
        onCancel={() => pageMgmt.setModalVisible(false)}
      />
    </div>
  );
};

export default InfoTab;
