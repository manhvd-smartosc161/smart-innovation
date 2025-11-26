import React, { useState } from 'react';
import { Checkbox } from 'antd';
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import './index.scss';

interface TreeItemProps {
  title: React.ReactNode;
  icon?: React.ReactNode | ((props: { expanded: boolean }) => React.ReactNode);
  nodeKey: string;
  isLeaf?: boolean;
  children?: React.ReactNode;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const TreeItem: React.FC<TreeItemProps> = ({
  title,
  icon,
  nodeKey,
  isLeaf,
  children,
  isSelected,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [checked, setChecked] = useState(false);

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  const handleSelect = () => {
    onSelect?.();
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setChecked(e.target.checked);
  };

  const renderIcon = () => {
    if (typeof icon === 'function') {
      return icon({ expanded });
    }
    return icon;
  };

  // Calculate depth based on key (e.g., "0-0-1" -> depth 2)
  const depth = nodeKey.split('-').length - 1;
  const indents = [];
  for (let i = 0; i < depth; i++) {
    indents.push(<div key={i} className="tree-indent" />);
  }

  return (
    <div className="tree-node">
      <div
        className={`tree-node-content ${isSelected ? 'selected' : ''}`}
        onClick={handleSelect}
      >
        {indents}
        <div
          className="tree-switcher"
          onClick={!isLeaf ? handleExpand : undefined}
        >
          {!isLeaf &&
            (expanded ? <CaretDownOutlined /> : <CaretRightOutlined />)}
        </div>
        <Checkbox
          checked={checked}
          onChange={handleCheck}
          onClick={(e) => e.stopPropagation()}
          className="tree-checkbox"
        />
        <span className="tree-icon">{renderIcon()}</span>
        <span className="tree-title">{title}</span>
      </div>
      {children && expanded && (
        <div className="tree-node-children">{children}</div>
      )}
    </div>
  );
};
