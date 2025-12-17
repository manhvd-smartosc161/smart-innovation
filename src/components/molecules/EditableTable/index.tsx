import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { Table, Button, message, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  HistoryOutlined,
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { EditableCell } from '../EditableCell';
import { useUndoRedo } from '@/hooks';
import './index.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditableColumnConfig<T = Record<string, any>> {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  editable?: boolean;
  type?: 'text' | 'dropdown';
  options?: string[] | ((record: T) => string[]);
  readOnly?: boolean | ((record: T) => boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T, index: number) => React.ReactNode;
  onCellChange?: (record: T, value: string) => Partial<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EditableTableProps<T extends Record<string, any>> {
  columns: EditableColumnConfig<T>[];
  dataSource: T[];
  onDataChange?: (data: T[]) => void;
  onSave?: (data: T[]) => void;
  onCellEdit?: (
    rowIndex: number,
    columnKey: string,
    oldValue: string,
    newValue: string,
    record: T
  ) => void;
  onRowAdd?: (newRow: T) => void;
  onRowDelete?: (deletedRows: T[]) => void;
  createEmptyRow: (existingData: T[]) => T;
  title?: string;
  showHistory?: boolean;
  onHistoryClick?: () => void;
  highlightedCells?: Set<string>;
}

interface EditingCell {
  rowIndex: number;
  columnKey: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function EditableTable<T extends Record<string, any>>({
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
}: EditableTableProps<T>) {
  const {
    state: data,
    setState: setData,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<T[]>(dataSource);

  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [changedCellsInternal, setChangedCellsInternal] = useState<Set<string>>(
    new Set()
  );
  const [highlightedCellsInternal, setHighlightedCellsInternal] = useState<
    Set<string>
  >(new Set());
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey?: React.Key;
    order?: 'ascend' | 'descend';
  }>({});

  const tableRef = useRef<HTMLDivElement>(null);
  const latestDataRef = useRef<T[]>(data);
  const isDraggingRef = useRef(false);
  const dragStartRowRef = useRef<number | null>(null);

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

  // Helpers
  const getCellElement = (rowIndex: number, key: string) =>
    tableRef.current?.querySelector(
      `[data-row-index="${rowIndex}"][data-column-key="${key}"]`
    ) as HTMLElement;

  const focusCell = useCallback(
    (rowIndex: number, key: string, openEditor = false) => {
      setTimeout(() => {
        const cell = getCellElement(rowIndex, key);
        if (cell) {
          cell.focus();
          if (openEditor) cell.click();
        }
      }, 150);
    },
    []
  );

  // Handlers
  const handleCellClick = useCallback(
    (rowIndex: number, columnKey: string, column: EditableColumnConfig<T>) => {
      const record = data[rowIndex];
      const isReadOnly =
        typeof column.readOnly === 'function'
          ? column.readOnly(record)
          : column.readOnly;
      if (!column.editable || isReadOnly) return;
      setEditingCell({ rowIndex, columnKey });
    },
    [data]
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
      focusCell(newData.length - 1, firstEditable.key);
    }

    if (onRowAdd) onRowAdd(newRow);
  }, [data, createEmptyRow, setData, columns, onRowAdd, focusCell]);

  const handleRemoveRows = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one row to remove');
      return;
    }
    const rowsToDelete = data.filter((_, index) =>
      selectedRowKeys.includes(index)
    );
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));

    setData(newData);
    setSelectedRowKeys([]);
    setHasChanges(true);
    message.success(`Removed ${selectedRowKeys.length} row(s)`);
    if (onRowDelete) onRowDelete(rowsToDelete);
  }, [data, selectedRowKeys, setData, onRowDelete]);

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

  // Navigation Logic
  const getNextEditablePosition = useCallback(
    (
      startRow: number,
      startColIndex: number,
      direction: 'forward' | 'backward'
    ) => {
      let colIndex = startColIndex;
      let rowIndex = startRow;
      const dataNow = latestDataRef.current;

      while (true) {
        if (direction === 'forward') {
          colIndex++;
          if (colIndex >= columns.length) {
            colIndex = 0;
            rowIndex++;
          }
        } else {
          colIndex--;
          if (colIndex < 0) {
            colIndex = columns.length - 1;
            rowIndex--;
          }
        }

        if (rowIndex < 0 || rowIndex >= dataNow.length) return null; // Boundary check

        const col = columns[colIndex];
        const record = dataNow[rowIndex];
        const isReadOnly =
          typeof col.readOnly === 'function'
            ? col.readOnly(record)
            : col.readOnly;

        if (col.editable && !isReadOnly) {
          return { rowIndex, colIndex, key: col.key };
        }
      }
    },
    [columns]
  );

  const navigateCell = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      direction: 'next' | 'prev' | 'down'
    ) => {
      const currentColIndex = columns.findIndex((c) => c.key === columnKey);
      if (currentColIndex === -1) return;

      if (direction === 'down') {
        // Simple down navigation
        const nextRow = rowIndex + 1;
        if (nextRow < latestDataRef.current.length) {
          const nextRecord = latestDataRef.current[nextRow];
          const targetCol = columns.find(
            (c) =>
              c.editable &&
              !(typeof c.readOnly === 'function'
                ? c.readOnly(nextRecord)
                : c.readOnly)
          );
          if (targetCol) focusCell(nextRow, targetCol.key);
        }
        return;
      }

      // Check last cell condition for 'next'
      if (direction === 'next') {
        // Check if last editable cell of last row
        const lastEditableCol = [...columns].reverse().find((c) => c.editable);
        const isLastCol = columns[currentColIndex].key === lastEditableCol?.key;
        const isLastRow = rowIndex === latestDataRef.current.length - 1;

        if (isLastCol && isLastRow) {
          handleAddRow(); // This handles focus internally
          return;
        }
      }

      const nextPos = getNextEditablePosition(
        rowIndex,
        currentColIndex,
        direction === 'next' ? 'forward' : 'backward'
      );
      if (nextPos) {
        focusCell(nextPos.rowIndex, nextPos.key, direction === 'next');
      }
    },
    [columns, getNextEditablePosition, handleAddRow, focusCell]
  );

  // Keyboard Event Handler
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

  // Column Construction
  const tableColumns: ColumnsType<T> = useMemo(
    () =>
      columns.map((col) => {
        const isSorted = sortedInfo.columnKey === col.key;

        return {
          key: col.key,
          title: (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {col.title}
              {isSorted && sortedInfo.order === 'ascend' && (
                <ArrowUpOutlined style={{ opacity: 0.45 }} />
              )}
              {isSorted && sortedInfo.order === 'descend' && (
                <ArrowDownOutlined style={{ opacity: 0.45 }} />
              )}
            </span>
          ),
          dataIndex: col.dataIndex,
          width: col.width,
          sorter: (a, b) =>
            String(a[col.dataIndex] || '').localeCompare(
              String(b[col.dataIndex] || '')
            ),
          sortOrder: isSorted ? sortedInfo.order : null,
          showSorterTooltip: false,
          filters:
            col.type === 'dropdown'
              ? Array.from(
                  new Set(data.map((item) => String(item[col.dataIndex] || '')))
                )
                  .filter((v) => v.trim() !== '' && v !== '-')
                  .sort()
                  .map((v) => ({ text: v, value: v }))
              : undefined,
          filterDropdown:
            col.type !== 'dropdown'
              ? ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                  <div style={{ padding: 8 }}>
                    <Input
                      placeholder={`Search ${col.title}`}
                      value={selectedKeys[0]}
                      onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                      }
                      onPressEnter={() => confirm()}
                      style={{ marginBottom: 8, display: 'block' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button
                        type="primary"
                        onClick={() => confirm()}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                      >
                        Search
                      </Button>
                      <Button
                        onClick={() => clearFilters?.()}
                        size="small"
                        style={{ width: 90 }}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )
              : undefined,
          filterIcon: (filtered) => (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ color: filtered ? '#1890ff' : 'rgba(0, 0, 0, 0.45)' }}
            >
              <path
                d="M4 6H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7 12H17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 18H14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
          onCell: (_, rowIndex) => ({
            onMouseDown: (e) => {
              if (rowIndex === undefined) return;

              // Don't interfere with checkbox clicks
              if ((e.target as HTMLElement).closest('.ant-checkbox-wrapper')) {
                return;
              }

              // Prevent default to stop focus
              e.preventDefault();

              // Remove focus from any focused element to prevent border
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }

              // Start drag selection (but don't select yet)
              isDraggingRef.current = true;
              dragStartRowRef.current = rowIndex;
            },
            onMouseEnter: () => {
              if (
                rowIndex === undefined ||
                !isDraggingRef.current ||
                dragStartRowRef.current === null
              )
                return;

              // Only select when dragging to a different row
              if (rowIndex === dragStartRowRef.current) return;

              // Drag selection - select range
              const start = Math.min(dragStartRowRef.current, rowIndex);
              const end = Math.max(dragStartRowRef.current, rowIndex);
              const range = Array.from(
                { length: end - start + 1 },
                (_, i) => start + i
              );
              setSelectedRowKeys(range);
            },
            onClick: (e) => {
              if (rowIndex === undefined) return;
              // Only focus if not dragging
              if (!isDraggingRef.current) {
                (e.currentTarget as HTMLElement).focus();
              }
            },
            onDoubleClick: () =>
              rowIndex !== undefined &&
              col.editable &&
              handleCellClick(rowIndex, col.key, col),
          }),
          render: (value, record, index) => {
            const isEditing =
              editingCell?.rowIndex === index &&
              editingCell?.columnKey === col.key;
            const cellKey = `${index}-${col.key}`;
            const isHighlighted =
              highlightedCells.has(cellKey) ||
              highlightedCellsInternal.has(cellKey);

            if (col.render && !isEditing)
              return col.render(value, record, index);

            if (isEditing) {
              const options =
                typeof col.options === 'function'
                  ? col.options(record)
                  : col.options || [];
              const isReadOnly =
                typeof col.readOnly === 'function'
                  ? col.readOnly(record)
                  : col.readOnly;

              return (
                <EditableCell
                  value={String(value || '')}
                  onChange={(v) => handleCellSave(index, col.key, v)}
                  onSave={() => setEditingCell(null)}
                  onCancel={handleCellCancel}
                  onNavigateNext={() => navigateCell(index, col.key, 'next')}
                  onNavigatePrevious={() =>
                    navigateCell(index, col.key, 'prev')
                  }
                  onNavigateDown={() => navigateCell(index, col.key, 'down')}
                  type={col.type}
                  options={options}
                  readOnly={isReadOnly}
                />
              );
            }

            const isReadOnly =
              typeof col.readOnly === 'function'
                ? col.readOnly(record)
                : col.readOnly;
            return (
              <div
                className={`editable-table-cell ${isHighlighted ? 'cell-highlighted' : ''} ${col.type === 'dropdown' ? 'has-dropdown' : ''}`}
                data-row-index={index}
                data-column-key={col.key}
                tabIndex={col.editable && !isReadOnly ? 0 : -1}
                onKeyDown={(e) => handleKeyDown(e, index, col.key)}
              >
                <span className="cell-content">{String(value || '-')}</span>
                {col.type === 'dropdown' && col.editable && !isReadOnly && (
                  <span
                    className="dropdown-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCellClick(index, col.key, col);
                    }}
                  >
                    ▼
                  </span>
                )}
              </div>
            );
          },
        };
      }),
    [
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
      setSelectedRowKeys,
    ]
  );

  return (
    <div
      className="editable-table-container"
      ref={tableRef}
      onMouseUp={() => {
        isDraggingRef.current = false;
        dragStartRowRef.current = null;
      }}
      onMouseLeave={() => {
        isDraggingRef.current = false;
        dragStartRowRef.current = null;
      }}
    >
      <div className="editable-table-header">
        {title && <h3>{title}</h3>}
        <div className="editable-table-actions">
          <Button icon={<PlusOutlined />} onClick={handleAddRow}>
            Add Row
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemoveRows}
            disabled={selectedRowKeys.length === 0}
          >
            Remove Row
          </Button>
          <Button
            icon={<UndoOutlined />}
            onClick={() => {
              if (canUndo) {
                undo();
                setEditingCell(null);
              }
            }}
            disabled={!canUndo}
            title="Undo"
          >
            Undo
          </Button>
          <Button
            icon={<RedoOutlined />}
            onClick={() => {
              if (canRedo) {
                redo();
                setEditingCell(null);
              }
            }}
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
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Save
          </Button>
        </div>
      </div>

      <Table<T>
        columns={tableColumns}
        dataSource={data}
        rowKey={(_, index) => index as number}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        pagination={false}
        bordered
        size="small"
        sticky={{ offsetHeader: 0 }}
        onChange={(_, __, s) => {
          const sorter = Array.isArray(s) ? s[0] : s;
          setSortedInfo({
            columnKey: sorter.columnKey,
            order: sorter.order || undefined,
          });
        }}
      />
    </div>
  );
}
