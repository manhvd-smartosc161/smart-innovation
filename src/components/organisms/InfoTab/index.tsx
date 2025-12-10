import React, { useState } from 'react';
import { Button, Input, Divider, message } from 'antd';
import {
  PlusOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { FileUploadItem } from '@/components/molecules';
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
import { INFO_TAB_LABELS, INFO_TAB_BUTTONS } from '@/constants';
import './index.scss';

const { TextArea } = Input;

export const InfoTab: React.FC = () => {
  const [uploads, setUploads] = useState<UploadedFile[]>([
    {
      id: '1',
      fileType: FILE_TYPES.BRD,
      file: null,
      prompt: '',
    },
  ]);

  const [tickets, setTickets] = useState<RelatedTicket[]>([]);
  const [confluencePages, setConfluencePages] = useState<ConfluencePage[]>([]);
  const [overallObjective, setOverallObjective] = useState<string>('');

  // Modal visibility state
  const [ticketModalVisible, setTicketModalVisible] = useState(false);
  const [pageModalVisible, setPageModalVisible] = useState(false);

  // File upload handlers
  const handleAddUpload = () => {
    const newUpload: UploadedFile = {
      id: Date.now().toString(),
      fileType: FILE_TYPES.BRD,
      file: null,
      prompt: '',
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

  const handleDeleteUpload = (id: string) => {
    setUploads(uploads.filter((upload) => upload.id !== id));
  };

  // Ticket selection handlers
  const handleTicketSelectionOk = (selectedIds: string[]) => {
    // Create tickets from selected IDs, preserving existing prompts
    const newTickets = selectedIds.map((ticketId) => {
      const existing = tickets.find((t) => t.ticketId === ticketId);
      return (
        existing || {
          id: Date.now().toString() + Math.random(),
          ticketId,
          prompt: '',
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

  const handleDeleteTicket = (ticketId: string) => {
    setTickets(tickets.filter((ticket) => ticket.ticketId !== ticketId));
  };

  // Confluence page selection handlers
  const handlePageSelectionOk = (selectedUrls: string[]) => {
    // Create pages from selected URLs, preserving existing prompts
    const newPages = selectedUrls.map((pageUrl) => {
      const existing = confluencePages.find((p) => p.url === pageUrl);
      return (
        existing || {
          id: Date.now().toString() + Math.random(),
          url: pageUrl,
          title: '', // Added to satisfy type requirement
          prompt: '',
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

  const handleDeletePage = (pageUrl: string) => {
    setConfluencePages(confluencePages.filter((page) => page.url !== pageUrl));
  };

  // Analysis handler
  const handleAnalyse = () => {
    const analysisData: AnalysisData = {
      files: uploads,
      tickets,
      confluencePages,
      overallObjective,
    };

    // For now, just log the data and show a message
    console.log('Analysis Data:', analysisData);
    message.success('Data has been collected for analysis!');

    // TODO: Add API call or further processing here
  };

  return (
    <div className="info-tab">
      {/* Analyse Button */}
      <div className="analyse-section">
        <div className="analyse-icon-left">
          <ThunderboltOutlined />
        </div>
        <Button
          type="primary"
          size="large"
          // icon={<ThunderboltOutlined />}
          onClick={handleAnalyse}
          className="analyse-button"
        >
          {INFO_TAB_LABELS.ANALYSE}
        </Button>
        <div className="analyse-icon-right">
          <RocketOutlined />
        </div>
      </div>

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
          >
            {INFO_TAB_BUTTONS.ADD_UPLOAD}
          </Button>
        </div>
        <div className="section-content">
          <div className="uploads-container">
            {uploads.map((upload) => (
              <FileUploadItem
                key={upload.id}
                id={upload.id}
                fileType={upload.fileType}
                prompt={upload.prompt}
                onFileTypeChange={handleFileTypeChange}
                onFileChange={handleFileChange}
                onPromptChange={handleFilePromptChange}
                onDelete={handleDeleteUpload}
              />
            ))}
          </div>
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
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="selected-item">
                    <div className="item-header">
                      <span className="item-id">{ticket.ticketId}</span>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteTicket(ticket.ticketId)}
                      />
                    </div>
                    <TextArea
                      rows={3}
                      placeholder="Enter prompt to guide AI about this ticket..."
                      value={ticket.prompt}
                      onChange={(e) =>
                        handleTicketPromptChange(
                          ticket.ticketId,
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
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
          >
            {INFO_TAB_BUTTONS.ADD_PAGES}
          </Button>
        </div>
        <div className="section-content">
          {confluencePages.length === 0 ? (
            <p className="empty-message">
              No pages selected yet. Click "Add Pages" to select from available
              pages.
            </p>
          ) : (
            <div className="selected-items-container">
              <div className="selected-items-list">
                {confluencePages.map((page) => (
                  <div key={page.id} className="selected-item">
                    <div className="item-header">
                      <span className="item-url">{page.url}</span>
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeletePage(page.url)}
                      />
                    </div>
                    <TextArea
                      rows={3}
                      placeholder="Enter prompt to guide AI about this page..."
                      value={page.prompt}
                      onChange={(e) =>
                        handlePagePromptChange(page.url, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
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
