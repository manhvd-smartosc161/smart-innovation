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
  title?: React.ReactNode;
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
  disabled?: boolean;
  hideSaveButton?: boolean;
  headerActions?: React.ReactNode;
  isActionHidden?: boolean;
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
  disabled = false,
  hideSaveButton = false,
  headerActions,
  isActionHidden,
}: HandsonTableHeaderProps) {
  const isAddRowDisabled = isFiltered || isSorted || disabled;

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
        {!isActionHidden && (
          <>
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
              disabled={selectedRowCount === 0 || disabled}
            >
              Remove Row
            </Button>
            <Button
              icon={<UndoOutlined />}
              onClick={onUndo}
              disabled={!canUndo || disabled}
              title="Undo"
            >
              Undo
            </Button>
            <Button
              icon={<RedoOutlined />}
              onClick={onRedo}
              disabled={!canRedo || disabled}
              title="Redo"
            >
              Redo
            </Button>
            {showHistory && (
              <Button icon={<HistoryOutlined />} onClick={onHistoryClick}>
                History
              </Button>
            )}
            {!hideSaveButton && (
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={onSave}
                disabled={!hasChanges || disabled}
              >
                Save
              </Button>
            )}
          </>
        )}
        {headerActions}
      </div>
    </div>
  );
}
