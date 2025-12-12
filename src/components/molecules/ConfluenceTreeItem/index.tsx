import React, { useState } from 'react';
import { Checkbox, Button, Tooltip, message } from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { ConfluencePageTree } from '@/types/confluence';
import './index.scss';

interface ConfluenceTreeItemProps {
  node: ConfluencePageTree;
  depth?: number;
  selectedUrls: string[];
  onToggle: (urls: string | string[]) => void;
  searchText?: string;
}

export const ConfluenceTreeItem: React.FC<ConfluenceTreeItemProps> = ({
  node,
  depth = 0,
  selectedUrls,
  onToggle,
  searchText = '',
}) => {
  const [expanded, setExpanded] = useState(true);
  const [showSync, setShowSync] = useState(false);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const titleRef = React.useRef<HTMLSpanElement>(null);
  const hasChildren = node.children && node.children.length > 0;

  // Helper function to get all URLs from this node and its children recursively
  const getAllUrls = (n: ConfluencePageTree): string[] => {
    const urls: string[] = [];
    if (n.url) {
      urls.push(n.url);
    }
    if (n.children && n.children.length > 0) {
      n.children.forEach((child) => {
        urls.push(...getAllUrls(child));
      });
    }
    return urls;
  };

  // Check if all children are selected (for folders)
  const areAllChildrenSelected = (): boolean => {
    if (!hasChildren) return false;
    const allChildUrls = getAllUrls(node).filter((url) => url !== node.url);
    return (
      allChildUrls.length > 0 &&
      allChildUrls.every((url) => selectedUrls.includes(url))
    );
  };

  // Determine if this node is selected
  const isSelected = (): boolean => {
    if (node.url) {
      // For items with URL, check if URL is selected
      return selectedUrls.includes(node.url);
    } else if (hasChildren) {
      // For folders without URL, check if all children are selected
      return areAllChildrenSelected();
    }
    return false;
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const handleToggle = () => {
    if (hasChildren) {
      // For folders: toggle all children URLs
      const allChildUrls = getAllUrls(node).filter((url) => url !== node.url);
      if (allChildUrls.length > 0) {
        onToggle(allChildUrls);
      }
    } else if (node.url) {
      // For pages: toggle single URL
      onToggle(node.url);
    }
  };

  const handleSync = (e: React.MouseEvent) => {
    e.stopPropagation();
    message.success(
      `Syncing ${node.type === 'folder' ? 'folder' : 'page'} ${node.title}...`
    );
    // TODO: Implement sync logic
  };

  // Recursively check if node or any of its descendants match search
  const nodeMatchesSearch = (n: ConfluencePageTree): boolean => {
    if (!searchText) return true;

    const nodeMatches =
      n.title.toLowerCase().includes(searchText.toLowerCase()) ||
      n.id.toLowerCase().includes(searchText.toLowerCase()) ||
      (n.url && n.url.toLowerCase().includes(searchText.toLowerCase()));

    if (nodeMatches) return true;

    // Check children recursively
    if (n.children && n.children.length > 0) {
      return n.children.some((child) => nodeMatchesSearch(child));
    }

    return false;
  };

  // Filter children recursively - keep children that match or have matching descendants
  const filteredChildren = hasChildren
    ? node.children!.filter((child) => nodeMatchesSearch(child))
    : [];

  // Show this node if it matches search or has matching children
  const matchesSearch = !searchText || nodeMatchesSearch(node);

  // Check if title is truncated
  React.useEffect(() => {
    const checkTruncation = () => {
      if (titleRef.current) {
        const element = titleRef.current;
        setIsTitleTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    // Check immediately
    checkTruncation();

    // Also check after a short delay to ensure layout is complete
    const timeoutId = setTimeout(checkTruncation, 0);

    return () => clearTimeout(timeoutId);
  }, [node.title]);

  if (!matchesSearch) {
    return null;
  }

  return (
    <div className="confluence-tree-item">
      <div
        className="confluence-tree-node"
        style={{ paddingLeft: `${depth * 24}px` }}
      >
        <div
          className={`tree-node-content ${node.url || hasChildren ? 'clickable' : ''}`}
          onMouseEnter={() => setShowSync(true)}
          onMouseLeave={() => setShowSync(false)}
          onClick={node.url || hasChildren ? handleToggle : undefined}
        >
          <div className="tree-switcher" onClick={handleExpand}>
            {hasChildren ? (
              expanded ? (
                <MinusSquareOutlined className="expand-icon" />
              ) : (
                <PlusSquareOutlined className="expand-icon" />
              )
            ) : (
              <span className="tree-switcher-placeholder" />
            )}
          </div>

          {node.type === 'folder' ? (
            <FolderOutlined className="tree-icon folder-icon" />
          ) : (
            <FileTextOutlined className="tree-icon page-icon" />
          )}

          {isTitleTruncated ? (
            <Tooltip title={node.title} placement="top" mouseEnterDelay={0.5}>
              <span ref={titleRef} className="tree-title">
                {node.title}
              </span>
            </Tooltip>
          ) : (
            <span ref={titleRef} className="tree-title">
              {node.title}
            </span>
          )}

          <div className="tree-actions" onClick={(e) => e.stopPropagation()}>
            {showSync && (node.url || hasChildren) && (
              <Button
                type="primary"
                size="small"
                className="tree-sync-btn"
                icon={<SyncOutlined />}
                onClick={handleSync}
              >
                Sync
              </Button>
            )}
            <span className="last-update">{node.lastUpdate}</span>
            <Checkbox
              checked={isSelected()}
              onChange={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              onClick={(e) => e.stopPropagation()}
              className="tree-checkbox"
            />
          </div>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="tree-children">
          {filteredChildren.map((child) => (
            <ConfluenceTreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedUrls={selectedUrls}
              onToggle={onToggle}
              searchText={searchText}
            />
          ))}
        </div>
      )}
    </div>
  );
};
