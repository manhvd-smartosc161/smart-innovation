import { useState } from 'react';
import type { ConfluencePage } from '@/types';

/**
 * Custom hook for managing Confluence pages in InfoTab
 *
 * Handles all page operations including:
 * - Page selection from modal
 * - Editing page prompts
 * - Accepting/discarding changes
 * - Deleting pages
 */
export const useConfluencePageManagement = () => {
  const [pages, setPages] = useState<ConfluencePage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectionOk = (
    selectedUrls: string[],
    defaultPrompt?: string
  ) => {
    const hasEditingPage = pages.some((page) => page.isEditing);
    if (hasEditingPage) {
      return;
    }

    const newPages = selectedUrls.map((pageUrl) => {
      const existing = pages.find((p) => p.url === pageUrl);
      if (existing) {
        return existing.prompt
          ? existing
          : { ...existing, prompt: defaultPrompt || '' };
      }
      return {
        id: Date.now().toString() + Math.random(),
        url: pageUrl,
        title: '',
        prompt: defaultPrompt || '',
        isEditing: false,
      };
    });
    setPages(newPages);
    setModalVisible(false);
  };

  const handlePromptChange = (pageUrl: string, prompt: string) => {
    setPages(
      pages.map((page) => (page.url === pageUrl ? { ...page, prompt } : page))
    );
  };

  const handleEdit = (pageUrl: string) => {
    const hasEditingPage = pages.some((page) => page.isEditing);
    if (hasEditingPage) {
      return;
    }
    setPages(
      pages.map((page) =>
        page.url === pageUrl ? { ...page, isEditing: true } : page
      )
    );
  };

  const handleAccept = (pageUrl: string) => {
    setPages(
      pages.map((page) =>
        page.url === pageUrl ? { ...page, isEditing: false } : page
      )
    );
  };

  const handleDiscard = (pageUrl: string) => {
    setPages(
      pages.map((page) =>
        page.url === pageUrl
          ? { ...page, isEditing: false, prompt: page.prompt || '' }
          : page
      )
    );
  };

  const handleDelete = (pageUrl: string) => {
    setPages(pages.filter((page) => page.url !== pageUrl));
  };

  const hasEditingPage = pages.some((page) => page.isEditing);

  return {
    pages,
    setPages,
    modalVisible,
    setModalVisible,
    handleSelectionOk,
    handlePromptChange,
    handleAccept,
    handleDiscard,
    handleEdit,
    handleDelete,
    hasEditingPage,
  };
};
