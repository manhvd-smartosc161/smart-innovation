import { Button, Tooltip } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

interface HandsonTableHeaderProps {
  title?: string;
  onAddRow: () => void;
  onRemoveRows: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onHistoryClick?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  hasChanges: boolean;
  selectedRowCount: number;
  showHistory?: boolean;
  isFiltered?: boolean;
  isSorted?: boolean;
}

export function HandsonTableHeader({
  title,
  onAddRow,
  onRemoveRows,
  onUndo,
  onRedo,
  onSave,
  onHistoryClick,
  canUndo,
  canRedo,
  hasChanges,
  selectedRowCount,
  showHistory = true,
  isFiltered = false,
  isSorted = false,
}: HandsonTableHeaderProps) {
  const isAddRowDisabled = isFiltered || isSorted;

  const getAddRowTooltip = () => {
    if (isFiltered && isSorted) {
      return 'Please clear filters and sorting before adding rows';
    }
    if (isFiltered) {
      return 'Please clear filters before adding rows';
    }
    if (isSorted) {
      return 'Please clear sorting before adding rows';
    }
    return '';
  };

  return (
    <div className="handson-table-header">
      {title && <h3>{title}</h3>}
      <div className="handson-table-actions">
        <Tooltip title={isAddRowDisabled ? getAddRowTooltip() : ''}>
          <Button
            icon={<PlusOutlined />}
            onClick={onAddRow}
            disabled={isAddRowDisabled}
          >
            Add Row
          </Button>
        </Tooltip>
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={onRemoveRows}
          disabled={selectedRowCount === 0}
        >
          Remove Row
        </Button>
        <Button
          icon={<UndoOutlined />}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          Undo
        </Button>
        <Button
          icon={<RedoOutlined />}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          Redo
        </Button>
        {showHistory && (
          <Button icon={<HistoryOutlined />} onClick={onHistoryClick}>
            History
          </Button>
        )}
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={onSave}
          disabled={!hasChanges}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
