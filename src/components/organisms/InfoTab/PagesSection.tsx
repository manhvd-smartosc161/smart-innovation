import React from 'react';
import { Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@/components/atoms';
import { ConfluencePageItem } from '@/components/molecules';
import type { ConfluencePage } from '@/types';
import { INFO_TAB_LABELS, INFO_TAB_BUTTONS } from '@/constants';

interface PagesSectionProps {
  pages: ConfluencePage[];
  disabled?: boolean;
  hasEditingPage: boolean;
  onOpenModal: () => void;
  onPromptChange: (pageUrl: string, prompt: string) => void;
  onAccept: (pageUrl: string) => void;
  onDiscard: (pageUrl: string) => void;
  onEdit: (pageUrl: string) => void;
  onDelete: (pageUrl: string) => void;
  promptExamples?: Record<string, string>;
}

/**
 * PagesSection component
 *
 * Displays the Confluence pages section in InfoTab
 */
export const PagesSection: React.FC<PagesSectionProps> = ({
  pages,
  disabled = false,
  hasEditingPage,
  onOpenModal,
  onPromptChange,
  onAccept,
  onDiscard,
  onEdit,
  onDelete,
  promptExamples,
}) => {
  return (
    <>
      <Divider />
      <div className="info-section">
        <div className="section-header">
          <h3>{INFO_TAB_LABELS.SELECT_RELATED_CONFLUENCE_PAGES}</h3>
          <Button
            variant="primary"
            icon={<PlusOutlined />}
            onClick={onOpenModal}
            disabled={disabled || hasEditingPage}
          >
            {INFO_TAB_BUTTONS.ADD_PAGES}
          </Button>
        </div>
        <div className="section-content">
          {pages.length === 0 ? (
            <p className="empty-message">
              No pages selected yet. Click "Add Pages" to select from available
              pages.
            </p>
          ) : (
            <div className="selected-items-container">
              <div className="selected-items-list">
                {pages.map((page) => {
                  const isDisabled =
                    disabled ||
                    pages.some((p) => p.url !== page.url && p.isEditing);
                  return (
                    <ConfluencePageItem
                      key={page.id}
                      page={page}
                      isDisabled={isDisabled}
                      onPromptChange={onPromptChange}
                      onAccept={onAccept}
                      onDiscard={onDiscard}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      promptExamples={promptExamples}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
