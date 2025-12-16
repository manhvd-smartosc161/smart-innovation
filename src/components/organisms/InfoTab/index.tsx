import React, { useState } from 'react';
import { Button, Input, Divider, Tooltip } from 'antd';
import {
  PlusOutlined,
  ThunderboltOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import {
  FileUploadItem,
  TicketItem,
  ConfluencePageItem,
} from '@/components/molecules';
import {
  TicketSelectionModal,
  PageSelectionModal,
} from '@/components/organisms';
import type {
  FileType,
  UploadedFile,
  RelatedTicket,
  ConfluencePage,
  AnalysisData,
} from '@/types';
import { FILE_TYPES } from '@/types';
import { INFO_TAB_LABELS, INFO_TAB_BUTTONS, TAB_KEYS } from '@/constants';
import { useAnalysis } from '@/contexts';
import './index.scss';

const { TextArea } = Input;

export const InfoTab: React.FC = () => {
  const { setIsAnalysed, setActiveTab } = useAnalysis();
  const [uploads, setUploads] = useState<UploadedFile[]>([]);

  const [tickets, setTickets] = useState<RelatedTicket[]>([]);
  const [confluencePages, setConfluencePages] = useState<ConfluencePage[]>([]);
  const [overallObjective, setOverallObjective] = useState<string>('');

  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [pageModalVisible, setPageModalVisible] = useState(false);

  const handleAddUpload = () => {
    const hasEditingFile = uploads.some((upload) => upload.isEditing);
    if (hasEditingFile) {
      return;
    }

    const newUpload: UploadedFile = {
      id: Date.now().toString(),
      fileType: FILE_TYPES.BRD,
      file: null,
      prompt: '',
      isEditing: true,
    };
    setUploads([...uploads, newUpload]);
  };

  const handleFileTypeChange = (id: string, fileType: FileType) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, fileType } : upload
      )
    );
  };

  const handleFileChange = (id: string, file: UploadFile | null) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id
          ? { ...upload, file: file?.originFileObj || null }
          : upload
      )
    );
  };

  const handleFilePromptChange = (id: string, prompt: string) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, prompt } : upload
      )
    );
  };

  const handleAcceptUpload = (id: string) => {
    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, isEditing: false } : upload
      )
    );
  };

  const handleDiscardUpload = (id: string) => {
    setUploads(uploads.filter((upload) => upload.id !== id));
  };

  const handleEditUpload = (id: string) => {
    const hasEditingFile = uploads.some((upload) => upload.isEditing);
    if (hasEditingFile) {
      return;
    }

    setUploads(
      uploads.map((upload) =>
        upload.id === id ? { ...upload, isEditing: true } : upload
      )
    );
  };

  const handleDeleteUpload = (id: string) => {
    setUploads(uploads.filter((upload) => upload.id !== id));
  };

  const handleTicketSelectionOk = (selectedIds: string[]) => {
    const hasEditingTicket = tickets.some((ticket) => ticket.isEditing);
    if (hasEditingTicket) {
      return;
    }

    const newTickets = selectedIds.map((ticketId) => {
      const existing = tickets.find((t) => t.ticketId === ticketId);
      return (
        existing || {
          id: Date.now().toString() + Math.random(),
          ticketId,
          prompt: '',
          isEditing: false,
        }
      );
    });
    setTickets(newTickets);
    setTicketModalVisible(false);
  };

  const handleTicketPromptChange = (ticketId: string, prompt: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId ? { ...ticket, prompt } : ticket
      )
    );
  };

  const handleAcceptTicket = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId ? { ...ticket, isEditing: false } : ticket
      )
    );
  };

  const handleDiscardTicket = (ticketId: string) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId
          ? { ...ticket, isEditing: false, prompt: ticket.prompt }
          : ticket
      )
    );
  };

  const handleEditTicket = (ticketId: string) => {
    const hasEditingTicket = tickets.some((ticket) => ticket.isEditing);
    if (hasEditingTicket) {
      return;
    }

    setTickets(
      tickets.map((ticket) =>
        ticket.ticketId === ticketId ? { ...ticket, isEditing: true } : ticket
      )
    );
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.ticketId !== ticketId));
  };

  const handlePageSelectionOk = (selectedUrls: string[]) => {
    const hasEditingPage = confluencePages.some((page) => page.isEditing);
    if (hasEditingPage) {
      return;
    }

    const newPages = selectedUrls.map((pageUrl) => {
      const existing = confluencePages.find((p) => p.url === pageUrl);
      return (
        existing || {
          id: Date.now().toString() + Math.random(),
          url: pageUrl,
          title: '',
          prompt: '',
          isEditing: false,
        }
      );
    });
    setConfluencePages(newPages);
    setPageModalVisible(false);
  };

  const handlePagePromptChange = (pageUrl: string, prompt: string) => {
    setConfluencePages(
      confluencePages.map((page) =>
        page.url === pageUrl ? { ...page, prompt } : page
      )
    );
  };

  const handleEditPage = (pageUrl: string) => {
    const hasEditingPage = confluencePages.some((page) => page.isEditing);
    if (hasEditingPage) {
      return;
    }
    setConfluencePages(
      confluencePages.map((page) =>
        page.url === pageUrl ? { ...page, isEditing: true } : page
      )
    );
  };

  const handleAcceptPage = (pageUrl: string) => {
    setConfluencePages(
      confluencePages.map((page) =>
        page.url === pageUrl ? { ...page, isEditing: false } : page
      )
    );
  };

  const handleDiscardPage = (pageUrl: string) => {
    setConfluencePages(
      confluencePages.map((page) =>
        page.url === pageUrl
          ? { ...page, isEditing: false, prompt: page.prompt || '' }
          : page
      )
    );
  };

  const handleDeletePage = (pageUrl: string) => {
    setConfluencePages(confluencePages.filter((page) => page.url !== pageUrl));
  };

  const [showRocket, setShowRocket] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleAnalyse = () => {
    const analysisData: AnalysisData = {
      files: uploads,
      tickets,
      confluencePages,
      overallObjective,
    };

    setShowRocket(true);

    setTimeout(() => {
      setShowRocket(false);
      setShowFireworks(true);
    }, 1500);

    setTimeout(() => {
      setShowFireworks(false);
      setIsAnalysed(true);
      setActiveTab(TAB_KEYS.SCOPE);
    }, 3500);

    console.log('Analysis Data:', analysisData);

    // TODO: Add API call or further processing here
  };

  const isAnalyseDisabled =
    !overallObjective.trim() ||
    uploads.filter((upload) => upload.file).length === 0 || // At least one file must be uploaded
    uploads.some((upload) => upload.isEditing) || // No upload should be in editing mode
    tickets.some((ticket) => ticket.isEditing) || // No ticket should be in editing mode
    confluencePages.some((page) => page.isEditing); // No page should be in editing mode

  // Generate tooltip message for disabled Analyse button
  const getAnalyseTooltip = (): string => {
    if (!isAnalyseDisabled) return '';

    const reasons: string[] = [];

    if (!overallObjective.trim()) {
      reasons.push('Please enter the Overall Objective');
    }

    if (uploads.filter((upload) => upload.file).length === 0) {
      reasons.push('Please upload at least one file');
    }

    if (uploads.some((upload) => upload.isEditing)) {
      reasons.push('Please save or discard file uploads being edited');
    }

    if (tickets.some((ticket) => ticket.isEditing)) {
      reasons.push('Please save or discard tickets being edited');
    }

    if (confluencePages.some((page) => page.isEditing)) {
      reasons.push('Please save or discard confluence pages being edited');
    }

    // Only add bullet points if there are 2 or more errors
    if (reasons.length >= 2) {
      return reasons.map((reason) => `• ${reason}`).join('\n');
    }

    return reasons[0] || '';
  };

  return (
    <div className="info-tab">
      {/* Rocket Animation */}
      {showRocket && (
        <div className="rocket-container">
          <div className="rocket">🚀</div>
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

      {/* Analyse Button - Sticky */}
      <div className="analyse-section">
        <div className="analyse-icon-left">
          <ThunderboltOutlined />
        </div>
        <Tooltip
          title={
            isAnalyseDisabled ? (
              <div style={{ whiteSpace: 'pre-line' }}>
                {getAnalyseTooltip()}
              </div>
            ) : (
              ''
            )
          }
          placement="bottom"
        >
          <span>
            <Button
              type="primary"
              size="large"
              onClick={handleAnalyse}
              disabled={isAnalyseDisabled}
              className="analyse-button"
            >
              {INFO_TAB_LABELS.ANALYSE}
            </Button>
          </span>
        </Tooltip>
        <div className="analyse-icon-right">
          <RocketOutlined />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="info-tab-content">
        <Divider />

        {/* Overall Objective Section */}
        <div className="info-section">
          <div className="section-header">
            <h3>{INFO_TAB_LABELS.OVERALL_OBJECTIVE}</h3>
          </div>
          <div className="section-content">
            <TextArea
              rows={4}
              placeholder="Enter the overall objective description for this test ticket..."
              value={overallObjective}
              onChange={(e) => setOverallObjective(e.target.value)}
              className="overall-objective-input"
            />
          </div>
        </div>

        <Divider />

        {/* File Upload Section */}
        <div className="info-section">
          <div className="section-header">
            <h3>{INFO_TAB_LABELS.UPLOAD_FILES}</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUpload}
              disabled={uploads.some((upload) => upload.isEditing)}
            >
              {INFO_TAB_BUTTONS.ADD_UPLOAD}
            </Button>
          </div>
          <div className="section-content">
            {uploads.length === 0 ? (
              <div className="empty-message">
                No files uploaded yet. Click "Add Upload" to upload a file.
              </div>
            ) : (
              <div className="uploads-container">
                {uploads.map((upload) => {
                  const hasEditingFile = uploads.some((u) => u.isEditing);
                  const isDisabled = hasEditingFile && !upload.isEditing;
                  return (
                    <FileUploadItem
                      key={upload.id}
                      id={upload.id}
                      fileType={upload.fileType}
                      fileName={upload.file?.name || null}
                      prompt={upload.prompt}
                      isEditing={upload.isEditing}
                      isDisabled={isDisabled}
                      onFileTypeChange={handleFileTypeChange}
                      onFileChange={handleFileChange}
                      onPromptChange={handleFilePromptChange}
                      onAccept={handleAcceptUpload}
                      onDiscard={handleDiscardUpload}
                      onEdit={handleEditUpload}
                      onDelete={handleDeleteUpload}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* Related Tickets Section */}
        <div className="info-section">
          <div className="section-header">
            <h3>{INFO_TAB_LABELS.SELECT_RELATED_TICKETS}</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setTicketModalVisible(true)}
              disabled={tickets.some((ticket) => ticket.isEditing)}
            >
              {INFO_TAB_BUTTONS.ADD_TICKETS}
            </Button>
          </div>
          <div className="section-content">
            {tickets.length === 0 ? (
              <p className="empty-message">
                No tickets selected yet. Click "Add Tickets" to select from
                available tickets.
              </p>
            ) : (
              <div className="selected-items-container">
                <div className="selected-items-list">
                  {tickets.map((ticket) => {
                    const hasEditingTicket = tickets.some((t) => t.isEditing);
                    const isDisabled = hasEditingTicket && !ticket.isEditing;
                    return (
                      <TicketItem
                        key={ticket.id}
                        ticket={ticket}
                        isDisabled={isDisabled}
                        onPromptChange={handleTicketPromptChange}
                        onAccept={handleAcceptTicket}
                        onDiscard={handleDiscardTicket}
                        onEdit={handleEditTicket}
                        onDelete={handleDeleteTicket}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* Confluence Pages Section */}
        <div className="info-section">
          <div className="section-header">
            <h3>{INFO_TAB_LABELS.SELECT_RELATED_CONFLUENCE_PAGES}</h3>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setPageModalVisible(true)}
              disabled={confluencePages.some((page) => page.isEditing)}
            >
              {INFO_TAB_BUTTONS.ADD_PAGES}
            </Button>
          </div>
          <div className="section-content">
            {confluencePages.length === 0 ? (
              <p className="empty-message">
                No pages selected yet. Click "Add Pages" to select from
                available pages.
              </p>
            ) : (
              <div className="selected-items-container">
                <div className="selected-items-list">
                  {confluencePages.map((page) => {
                    const isDisabled = confluencePages.some(
                      (p) => p.url !== page.url && p.isEditing
                    );
                    return (
                      <ConfluencePageItem
                        key={page.id}
                        page={page}
                        isDisabled={isDisabled}
                        onPromptChange={handlePagePromptChange}
                        onAccept={handleAcceptPage}
                        onDiscard={handleDiscardPage}
                        onEdit={handleEditPage}
                        onDelete={handleDeletePage}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TicketSelectionModal
        visible={ticketModalVisible}
        selectedTicketIds={tickets.map((t) => t.ticketId)}
        onOk={handleTicketSelectionOk}
        onCancel={() => setTicketModalVisible(false)}
      />
      <PageSelectionModal
        visible={pageModalVisible}
        selectedPageUrls={confluencePages.map((p) => p.url)}
        onOk={handlePageSelectionOk}
        onCancel={() => setPageModalVisible(false)}
      />
    </div>
  );
};
