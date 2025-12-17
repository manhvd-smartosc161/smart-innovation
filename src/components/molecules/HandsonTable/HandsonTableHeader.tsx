import { Button } from 'antd';
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
}: HandsonTableHeaderProps) {
  return (
    <div className="handson-table-header">
      {title && <h3>{title}</h3>}
      <div className="handson-table-actions">
        <Button icon={<PlusOutlined />} onClick={onAddRow}>
          Add Row
        </Button>
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
