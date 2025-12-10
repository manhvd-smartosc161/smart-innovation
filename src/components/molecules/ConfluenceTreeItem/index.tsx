import React, { useState } from 'react';
import { Checkbox } from 'antd';
import {
  FolderOutlined,
  FileTextOutlined,
  MinusSquareOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import type { ConfluencePageTree } from '@/types/confluence';
import './index.scss';

interface ConfluenceTreeItemProps {
  node: ConfluencePageTree;
  depth?: number;
  selectedUrls: string[];
  onToggle: (url: string) => void;
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
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = node.url ? selectedUrls.includes(node.url) : false;

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  const handleToggle = () => {
    if (node.type === 'page' && node.url) {
      onToggle(node.url);
    }
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
          className={`tree-node-content ${node.type === 'page' ? 'clickable' : ''}`}
          onClick={node.type === 'page' ? handleToggle : undefined}
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

          <span className="tree-title">{node.title}</span>

          <span className="last-update">{node.lastUpdate}</span>

          {node.type === 'page' && (
            <Checkbox
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation();
                handleToggle();
              }}
              onClick={(e) => e.stopPropagation()}
              className="tree-checkbox"
            />
          )}
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
