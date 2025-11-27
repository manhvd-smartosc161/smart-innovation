import React, { useState } from 'react';
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
            children: [
              {
                key: '0-0-0-0-0',
                title: 'Create order with invalid data',
                type: 'file',
                isLeaf: true,
              },
              {
                key: '0-0-0-0-1',
                title: 'Create order with invalid data',
                type: 'file',
                isLeaf: true,
              },
              {
                key: '0-0-0-0-2',
                title: 'Create order with invalid data',
                type: 'file',
                isLeaf: true,
              },
              {
                key: '0-0-0-0-3',
                title: 'Create order with invalid data',
                type: 'file',
                isLeaf: true,
              },
              {
                key: '0-0-0-0-4',
                title: 'Create order with invalid data',
                type: 'file',
                isLeaf: true,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const TestCaseTree: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['0-0-0-0-0']);
  // const [activeMode, setActiveMode] = useState<'edit' | 'view'>('view');

  const handleSelect = (keys: string[]) => {
    setSelectedKeys(keys);
  };

  const renderTreeNodes = (data: TreeNode[]) =>
    data.map((item) => {
      const isSelected = selectedKeys.includes(item.key);

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
            onSelect={() => handleSelect([item.key])}
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
          onSelect={() => handleSelect([item.key])}
        />
      );
    });

  return (
    <div className="test-case-tree-container">
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
