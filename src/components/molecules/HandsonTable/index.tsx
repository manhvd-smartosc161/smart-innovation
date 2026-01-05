import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table, message } from 'antd';
import { useUndoRedo } from '@/hooks';
import { HandsonTableHeader } from './HandsonTableHeader';
import { useTableNavigation, useTableColumns } from '@/hooks/handsonTable';
import type {
  HandsonTableProps,
  HandsonCellState,
  SortedInfo,
} from '@/types/handsonTable';
import './index.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function HandsonTable<T extends Record<string, any>>({
  columns,
  dataSource,
  onDataChange,
  onSave,
  onCellEdit,
  onRowAdd,
  onRowDelete,
  createEmptyRow,
  title,
  showHistory = true,
  onHistoryClick,
  highlightedCells = new Set(),
  disabled = false,
  hideSaveButton = false,
  headerActions,
}: HandsonTableProps<T>) {
  const {
    state: data,
    setState: setData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<T[]>(dataSource);

  const [editingCell, setEditingCell] = useState<HandsonCellState | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedCellsInternal, setChangedCellsInternal] = useState<Set<string>>(
    new Set()
  );
  const [highlightedCellsInternal, setHighlightedCellsInternal] = useState<
    Set<string>
  >(new Set());
  const [sortedInfo, setSortedInfo] = useState<SortedInfo>({});
  const [filteredInfo, setFilteredInfo] = useState<
    Record<string, React.Key[] | null>
  >({});

  const tableRef = useRef<HTMLDivElement>(null);
  const latestDataRef = useRef<T[]>(data);

  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(dataSource)) {
      setData(dataSource);
    }
  }, [dataSource, setData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (onDataChange && JSON.stringify(data) !== JSON.stringify(dataSource)) {
      onDataChange(data);
      setHasChanges(true);
    }
  }, [data, dataSource, onDataChange]);

  // Check if table is filtered or sorted
  const isFiltered = Object.keys(filteredInfo).some(
    (key) => filteredInfo[key] && filteredInfo[key].length > 0
  );
  const isSorted = !!sortedInfo.order;

  // Handlers
  const handleCellClick = useCallback(
    (rowIndex: number, columnKey: string, column: (typeof columns)[0]) => {
      if (disabled) return;
      const record = data[rowIndex];
      const isReadOnly =
        typeof column.readOnly === 'function'
          ? column.readOnly(record)
          : column.readOnly;
      if (!column.editable || isReadOnly) return;
      setEditingCell({ rowIndex, columnKey });
    },
    [data, disabled]
  );

  const handleCellSave = useCallback(
    (rowIndex: number, columnKey: string, value: string) => {
      const newData = [...data];
      const record = newData[rowIndex];
      const column = columns.find((col) => col.key === columnKey);
      const oldValue = String(record[columnKey] || '');

      if (!column) return;

      if (column.onCellChange) {
        const updates = column.onCellChange(record, value);
        newData[rowIndex] = { ...record, ...updates };
      } else {
        newData[rowIndex] = { ...record, [columnKey]: value };
      }

      latestDataRef.current = newData;
      setData(newData);
      setEditingCell(null);

      if (onCellEdit && oldValue !== value) {
        onCellEdit(rowIndex, columnKey, oldValue, value, newData[rowIndex]);
      }

      setChangedCellsInternal((prev) =>
        new Set(prev).add(`${rowIndex}-${columnKey}`)
      );
      setHasChanges(true);
    },
    [data, setData, columns, onCellEdit]
  );

  const handleCellCancel = useCallback(() => setEditingCell(null), []);

  const handleAddRow = useCallback(() => {
    const newRow = createEmptyRow(data);
    const newData = [...data, newRow];
    setData(newData);
    setHasChanges(true);

    // Auto focus first editable cell of new row
    const firstEditable = columns.find((c) => c.editable);
    if (firstEditable) {
      setTimeout(() => {
        const cell = document.querySelector(
          `[data-row-index="${newData.length - 1}"][data-column-key="${firstEditable.key}"]`
        ) as HTMLElement;
        cell?.focus();
      }, 150);
    }

    if (onRowAdd) onRowAdd(newRow);
  }, [data, createEmptyRow, setData, columns, onRowAdd]);

  const handleRemoveRows = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one row to remove');
      return;
    }

    // Get the key field from the first column
    const keyField = columns[0].dataIndex;

    // Filter rows based on the actual rowKey values
    const rowsToDelete = data.filter((record) =>
      selectedRowKeys.includes(String(record[keyField]))
    );
    const newData = data.filter(
      (record) => !selectedRowKeys.includes(String(record[keyField]))
    );

    setData(newData);
    setSelectedRowKeys([]);
    setHasChanges(true);
    message.success(`Removed ${selectedRowKeys.length} row(s)`);
    if (onRowDelete) onRowDelete(rowsToDelete);
  }, [data, selectedRowKeys, setData, onRowDelete, columns]);

  const handleSave = useCallback(() => {
    if (data.length === 0) {
      message.warning('Please add at least one row before saving.');
      return;
    }
    onSave?.(data);
    setHighlightedCellsInternal(new Set(changedCellsInternal));
    setChangedCellsInternal(new Set());
    setHasChanges(false);
    message.success('Data saved successfully!');
  }, [data, onSave, changedCellsInternal]);

  // Navigation
  const { focusCell, navigateCell } = useTableNavigation(
    columns,
    latestDataRef,
    handleAddRow
  );

  // Keyboard Handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, columnKey: string) => {
      if (editingCell) return;

      const colIndex = columns.findIndex((c) => c.key === columnKey);

      // Shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) {
          undo();
          setEditingCell(null);
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) {
          redo();
          setEditingCell(null);
        }
        return;
      }

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          handleCellClick(rowIndex, columnKey, columns[colIndex]);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (colIndex < columns.length - 1)
            focusCell(rowIndex, columns[colIndex + 1].key);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (colIndex > 0) focusCell(rowIndex, columns[colIndex - 1].key);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (rowIndex < data.length - 1) focusCell(rowIndex + 1, columnKey);
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (rowIndex > 0) focusCell(rowIndex - 1, columnKey);
          break;
        case 'Tab':
          e.preventDefault();
          navigateCell(rowIndex, columnKey, e.shiftKey ? 'prev' : 'next');
          break;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          handleCellSave(rowIndex, columnKey, '');
          break;
      }
    },
    [
      editingCell,
      columns,
      data.length,
      handleCellClick,
      handleCellSave,
      undo,
      redo,
      canUndo,
      canRedo,
      focusCell,
      navigateCell,
    ]
  );

  // Table Columns
  const tableColumns = useTableColumns({
    columns,
    data,
    sortedInfo,
    editingCell,
    highlightedCells,
    highlightedCellsInternal,
    handleCellClick,
    handleCellSave,
    handleCellCancel,
    handleKeyDown,
    navigateCell,
  });

  return (
    <div
      className={`handson-table-container ${disabled ? 'disabled' : ''}`}
      ref={tableRef}
    >
      <HandsonTableHeader
        title={title}
        onAddRow={handleAddRow}
        onRemoveRows={handleRemoveRows}
        onUndo={() => {
          if (canUndo) {
            undo();
            setEditingCell(null);
          }
        }}
        onRedo={() => {
          if (canRedo) {
            redo();
            setEditingCell(null);
          }
        }}
        onSave={handleSave}
        onHistoryClick={onHistoryClick}
        canUndo={canUndo}
        canRedo={canRedo}
        hasChanges={hasChanges}
        selectedRowCount={selectedRowKeys.length}
        showHistory={showHistory}
        isFiltered={isFiltered}
        isSorted={isSorted}
        disabled={disabled}
        hideSaveButton={hideSaveButton}
        headerActions={headerActions}
      />

      {disabled && (
        <div className="read-only-banner">
          <span className="read-only-icon">🔒</span>
          <span className="read-only-text">
            Read-only mode. Click the <strong>Edit</strong> button to make
            changes.
          </span>
        </div>
      )}

      <Table<T>
        columns={tableColumns}
        dataSource={data}
        rowKey={(record) => String(record[columns[0].dataIndex])}
        rowSelection={
          disabled
            ? undefined
            : {
                selectedRowKeys,
                onChange: setSelectedRowKeys,
                preserveSelectedRowKeys: true,
              }
        }
        pagination={false}
        bordered
        size="small"
        sticky={{ offsetHeader: 0 }}
        scroll={{ x: 'max-content' }}
        onChange={(_, filters, sorter) => {
          if (disabled) return;
          const s = Array.isArray(sorter) ? sorter[0] : sorter;
          setSortedInfo({
            columnKey: s.columnKey,
            order: s.order || undefined,
          });
          setFilteredInfo(filters as Record<string, React.Key[] | null>);
        }}
      />
    </div>
  );
}

// Re-export types for convenience
export type {
  HandsonColumnConfig,
  HandsonTableProps,
} from '../../../types/handsonTable';
