import React, { useState, useCallback } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { MOCK_CONFLUENCE_PAGES_TREE } from '@/mock';
import { ConfluenceTreeItem } from '@/components/molecules/ConfluenceTreeItem';
import './index.scss';

const { Search } = Input;

interface PageSelectionModalProps {
  visible: boolean;
  selectedPageUrls: string[];
  onOk: (selectedUrls: string[]) => void;
  onCancel: () => void;
}

export const PageSelectionModal: React.FC<PageSelectionModalProps> = ({
  visible,
  selectedPageUrls,
  onOk,
  onCancel,
}) => {
  const [searchText, setSearchText] = useState('');
  const [localSelectedUrls, setLocalSelectedUrls] =
    useState<string[]>(selectedPageUrls);

  // Reset local selection when modal opens
  React.useEffect(() => {
    if (visible) {
      setLocalSelectedUrls(selectedPageUrls);
      setSearchText('');
    }
  }, [visible, selectedPageUrls]);

  const handleToggle = useCallback((url: string) => {
    setLocalSelectedUrls((prev) => {
      if (prev.includes(url)) {
        return prev.filter((u) => u !== url);
      } else {
        return [...prev, url];
      }
    });
  }, []);

  const handleRefresh = () => {
    message.info('Refreshing Confluence pages...');
    // TODO: Add API call to refresh pages
  };

  const handleOk = () => {
    onOk(localSelectedUrls);
  };

  const handleCancel = () => {
    setLocalSelectedUrls(selectedPageUrls);
    onCancel();
  };

  // Count root pages
  const rootPageCount = MOCK_CONFLUENCE_PAGES_TREE.length;

  return (
    <Modal
      title="Confluence Pages"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={900}
      className="page-selection-modal"
      okText="Select"
      cancelText="Cancel"
    >
      <div className="modal-content">
        <div className="modal-header">
          <Search
            placeholder="Search pages by title or ID..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className="search-input"
          />
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            className="refresh-button"
          >
            Refresh
          </Button>
        </div>

        <div className="page-tree-container">
          <div className="page-tree">
            {MOCK_CONFLUENCE_PAGES_TREE.map((node) => (
              <ConfluenceTreeItem
                key={node.id}
                node={node}
                selectedUrls={localSelectedUrls}
                onToggle={handleToggle}
                searchText={searchText}
              />
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <span className="page-count">{rootPageCount} root page found</span>
        </div>
      </div>
    </Modal>
  );
};
