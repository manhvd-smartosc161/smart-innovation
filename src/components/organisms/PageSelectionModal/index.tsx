import React, { useState } from 'react';
import { Modal, Checkbox, Input } from 'antd';
import { MOCK_CONFLUENCE_PAGES } from '@/mock';
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

  const filteredPages = MOCK_CONFLUENCE_PAGES.filter(
    (page) =>
      page.id.toLowerCase().includes(searchText.toLowerCase()) ||
      page.title.toLowerCase().includes(searchText.toLowerCase()) ||
      page.url.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckboxChange = (pageUrl: string, checked: boolean) => {
    if (checked) {
      setLocalSelectedUrls([...localSelectedUrls, pageUrl]);
    } else {
      setLocalSelectedUrls(localSelectedUrls.filter((url) => url !== pageUrl));
    }
  };

  const handleOk = () => {
    onOk(localSelectedUrls);
  };

  const handleCancel = () => {
    setLocalSelectedUrls(selectedPageUrls);
    onCancel();
  };

  return (
    <Modal
      title="Select Related Confluence Pages"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={700}
      className="page-selection-modal"
    >
      <div className="modal-content">
        <Search
          placeholder="Search pages by title or URL..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <div className="page-list">
          {filteredPages.map((page) => (
            <div key={page.id} className="page-item">
              <Checkbox
                checked={localSelectedUrls.includes(page.url)}
                onChange={(e) =>
                  handleCheckboxChange(page.url, e.target.checked)
                }
              >
                <div className="page-info">
                  <span className="page-title">{page.title}</span>
                  <span className="page-url">{page.url}</span>
                </div>
              </Checkbox>
            </div>
          ))}
          {filteredPages.length === 0 && (
            <div className="empty-state">No pages found</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
