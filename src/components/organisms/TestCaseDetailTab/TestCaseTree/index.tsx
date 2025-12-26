import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'antd';
import {
  FileTextOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons';
import { TreeItem } from '@/components/molecules';
import type { TreeNode } from '@/types';
import './index.scss';

const initialTreeData: TreeNode[] = [
  {
    key: '0-0',
    title: 'JIRA_TICKET_001',
    type: 'folder',
    children: [
      {
        key: '0-0-0',
        title: 'Create order',
        type: 'folder',
        children: [
          {
            key: '0-0-0-0',
            title: 'Order Senario',
            type: 'folder',
          },
          {
            key: '0-0-0-1',
            title: 'Create order with invalid data',
            type: 'file',
            isLeaf: true,
          },
          {
            key: '0-0-0-2',
            title: 'Create order with invalid data',
            type: 'file',
            isLeaf: true,
          },
          {
            key: '0-0-0-3',
            title: 'Create order with invalid data',
            type: 'file',
            isLeaf: true,
          },
          {
            key: '0-0-0-4',
            title: 'Create order with invalid data',
            type: 'file',
            isLeaf: true,
          },
          {
            key: '0-0-0-5',
            title: 'Create order with invalid data',
            type: 'file',
            isLeaf: true,
          },
        ],
      },
    ],
  },
];

export const TestCaseTree: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['0-0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  // const [activeMode, setActiveMode] = useState<'edit' | 'view'>('view');

  // Helper function to get all descendant keys of a node
  const getAllDescendantKeys = (node: TreeNode): string[] => {
    let keys: string[] = [node.key];
    if (node.children) {
      node.children.forEach((child) => {
        keys = keys.concat(getAllDescendantKeys(child));
      });
    }
    return keys;
  };

  // Find node by key in tree
  const findNodeByKey = (data: TreeNode[], key: string): TreeNode | null => {
    for (const node of data) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const handleSelect = (keys: string[]) => {
    if (keys.length === 0) {
      setSelectedKeys([]);
      return;
    }

    const clickedKey = keys[0];
    const clickedNode = findNodeByKey(initialTreeData, clickedKey);

    if (clickedNode && clickedNode.children) {
      // If it's a parent node, select all descendants
      const allKeys = getAllDescendantKeys(clickedNode);
      setSelectedKeys(allKeys);
    } else {
      // If it's a leaf node, just select it
      setSelectedKeys(keys);
    }
  };

  const handleCheck = (nodeKey: string, checked: boolean) => {
    const node = findNodeByKey(initialTreeData, nodeKey);

    if (!node) return;

    if (checked) {
      // Check this node and all descendants
      const allKeys = getAllDescendantKeys(node);
      setCheckedKeys((prev) => [...new Set([...prev, ...allKeys])]);
    } else {
      // Uncheck this node and all descendants
      const allKeys = getAllDescendantKeys(node);
      setCheckedKeys((prev) => prev.filter((key) => !allKeys.includes(key)));
    }
  };

  // Click outside detection
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (treeRef.current && !treeRef.current.contains(event.target as Node)) {
        // Clicked outside tree, clear selection
        setSelectedKeys([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderTreeNodes = (data: TreeNode[]) =>
    data.map((item) => {
      const isSelected = selectedKeys.includes(item.key);
      const isChecked = checkedKeys.includes(item.key);

      if (item.children) {
        return (
          <TreeItem
            key={item.key}
            title={
              <Tooltip title={item.title} mouseEnterDelay={0.5}>
                <span>{item.title}</span>
              </Tooltip>
            }
            icon={({ expanded }) =>
              expanded ? <FolderOpenOutlined /> : <FolderOutlined />
            }
            nodeKey={item.key}
            isSelected={isSelected}
            checked={isChecked}
            onSelect={() => handleSelect([item.key])}
            onCheck={(checked) => handleCheck(item.key, checked)}
          >
            {renderTreeNodes(item.children)}
          </TreeItem>
        );
      }
      return (
        <TreeItem
          key={item.key}
          title={
            <Tooltip title={item.title} mouseEnterDelay={0.5}>
              <span>{item.title}</span>
            </Tooltip>
          }
          icon={<FileTextOutlined />}
          nodeKey={item.key}
          isLeaf
          isSelected={isSelected}
          checked={isChecked}
          onSelect={() => handleSelect([item.key])}
          onCheck={(checked) => handleCheck(item.key, checked)}
        />
      );
    });

  return (
    <div className="test-case-tree-container" ref={treeRef}>
      {/* <div className="sidebar-header">
        <h3 className="sidebar-title">OMS Test Inventory</h3>
        <div className="sidebar-actions-container">
          <ModeSwitch activeMode={activeMode} onModeChange={setActiveMode} />
          <div className="action-icons">
            <IconButton icon={<PlusOutlined />} />
            <IconButton icon={<DeleteOutlined />} danger />
            <IconButton icon={<MoreOutlined />} />
          </div>
        </div>
      </div> */}
      <div className="sidebar-content">{renderTreeNodes(initialTreeData)}</div>
    </div>
  );
};
