import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Table, Button, message, Input } from 'antd';
import type { TablePaginationConfig } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
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
  const tableRef = useRef<HTMLDivElement>(null);
  const latestDataRef = useRef<T[]>(data);

  // Keep latestDataRef in sync with data
  useEffect(() => {
    latestDataRef.current = data;
  }, [data]);

  // Sync external data changes
  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(dataSource)) {
      setData(dataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange && JSON.stringify(data) !== JSON.stringify(dataSource)) {
      onDataChange(data);
      setHasChanges(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleCellClick = useCallback(
    (rowIndex: number, columnKey: string, column: EditableColumnConfig<T>) => {
      const record = data[rowIndex];

      // Check if cell is read-only
      const isReadOnly =
        typeof column.readOnly === 'function'
          ? column.readOnly(record)
          : column.readOnly;

      if (!column.editable || isReadOnly) {
        return;
      }

      setEditingCell({ rowIndex, columnKey });
    },
    [data]
  );

  const handleCellSave = useCallback(
    (rowIndex: number, columnKey: string, value: string) => {
      const newData = [...data];
      const record = newData[rowIndex];
      const column = columns.find((col) => col.key === columnKey);

      // Get old value for history
      const oldValue = String(record[columnKey] || '');

      // Use custom cell change handler if provided
      if (column?.onCellChange) {
        const updates = column.onCellChange(record, value);
        newData[rowIndex] = { ...record, ...updates };
      } else {
        newData[rowIndex] = { ...record, [columnKey]: value };
      }

      // Update ref immediately for navigation
      latestDataRef.current = newData;
      setData(newData);
      setEditingCell(null);

      // Notify parent of cell edit for history tracking
      if (onCellEdit && oldValue !== value) {
        onCellEdit(rowIndex, columnKey, oldValue, value, newData[rowIndex]);
      }

      // Track changed cell
      const cellKey = `${rowIndex}-${columnKey}`;
      setChangedCellsInternal((prev) => new Set(prev).add(cellKey));
      setHasChanges(true);
    },
    [data, setData, columns, onCellEdit]
  );

  const handleCellCancel = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleAddRow = useCallback(() => {
    const newRow = createEmptyRow(data);
    setData([...data, newRow]);
    setHasChanges(true);

    // Focus on the first editable cell of the new row (but don't open editor)
    setTimeout(() => {
      const firstEditableColumn = columns.find((col) => col.editable);
      if (firstEditableColumn) {
        const cellElement = tableRef.current?.querySelector(
          `[data-row-index="${data.length}"][data-column-key="${firstEditableColumn.key}"]`
        ) as HTMLElement;
        cellElement?.focus();
      }
    }, 100);

    // Notify parent of row addition for history tracking
    if (onRowAdd) {
      onRowAdd(newRow);
    }
  }, [data, createEmptyRow, setData, columns, onRowAdd]);

  const handleRemoveRows = useCallback(() => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one row to remove');
      return;
    }

    const rowsToDelete = data.filter((_, index) =>
      selectedRowKeys.includes(index)
    );
    const newData = data.filter((_, index) => !selectedRowKeys.includes(index));
    latestDataRef.current = newData;
    setData(newData);
    setSelectedRowKeys([]);
    setHasChanges(true);
    message.success(`Removed ${selectedRowKeys.length} row(s)`);

    // Notify parent of row deletion for history tracking
    if (onRowDelete) {
      onRowDelete(rowsToDelete);
    }
  }, [data, selectedRowKeys, setData, onRowDelete]);

  const handleSave = useCallback(() => {
    if (data.length === 0) {
      message.warning('Please add at least one row before saving.');
      return;
    }

    if (onSave) {
      onSave(data);
    }

    // Move changed cells to highlighted for visual feedback
    setHighlightedCellsInternal(new Set(changedCellsInternal));
    // Clear changed cells for next edit cycle
    setChangedCellsInternal(new Set());
    setHasChanges(false);
    message.success('Data saved successfully!');
  }, [data, onSave, changedCellsInternal]);

  const handleUndo = useCallback(() => {
    if (canUndo) {
      undo();
      setEditingCell(null);
    } else {
      message.info('No actions to undo');
    }
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo) {
      redo();
      setEditingCell(null);
    } else {
      message.info('No actions to redo');
    }
  }, [canRedo, redo]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, rowIndex: number, columnKey: string) => {
      // If currently editing, let the EditableCell handle it
      if (editingCell) {
        return;
      }

      const currentColumnIndex = columns.findIndex(
        (col) => col.key === columnKey
      );

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          handleCellClick(rowIndex, columnKey, columns[currentColumnIndex]);
          break;

        case 'ArrowRight':
          e.preventDefault();
          // Navigate to next cell in same row (any cell, not just editable)
          if (currentColumnIndex < columns.length - 1) {
            const nextColumn = columns[currentColumnIndex + 1];
            const cellElement = tableRef.current?.querySelector(
              `[data-row-index="${rowIndex}"][data-column-key="${nextColumn.key}"]`
            ) as HTMLElement;
            cellElement?.focus();
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          // Navigate to previous cell in same row (any cell, not just editable)
          if (currentColumnIndex > 0) {
            const prevColumn = columns[currentColumnIndex - 1];
            const cellElement = tableRef.current?.querySelector(
              `[data-row-index="${rowIndex}"][data-column-key="${prevColumn.key}"]`
            ) as HTMLElement;
            cellElement?.focus();
          }
          break;

        case 'Tab':
          if (!e.shiftKey) {
            e.preventDefault();

            // Check if we're at the last editable cell of the last row
            let lastEditableColumnIndex = -1;
            for (let i = columns.length - 1; i >= 0; i--) {
              if (columns[i].editable) {
                lastEditableColumnIndex = i;
                break;
              }
            }

            const isLastColumn = currentColumnIndex === lastEditableColumnIndex;
            const isLastRow = rowIndex === data.length - 1;

            if (isLastColumn && isLastRow) {
              // Add new row and focus first editable cell
              const newRow = createEmptyRow(data);
              const newData = [...data, newRow];
              latestDataRef.current = newData;
              setData(newData);
              setHasChanges(true);

              setTimeout(() => {
                const firstEditableColumn = columns.find((c) => c.editable);
                if (firstEditableColumn) {
                  const cellElement = tableRef.current?.querySelector(
                    `[data-row-index="${data.length}"][data-column-key="${firstEditableColumn.key}"]`
                  ) as HTMLElement;
                  cellElement?.focus();
                }
              }, 150);
              break;
            }

            // Move to next editable cell
            let nextColumnIndex = currentColumnIndex + 1;
            let nextRowIndex = rowIndex;

            while (
              nextColumnIndex < columns.length ||
              nextRowIndex < data.length - 1
            ) {
              if (nextColumnIndex >= columns.length) {
                nextColumnIndex = 0;
                nextRowIndex++;
              }

              if (nextRowIndex >= data.length) break;

              const nextColumn = columns[nextColumnIndex];
              const nextRecord = data[nextRowIndex];
              const isReadOnly =
                typeof nextColumn.readOnly === 'function'
                  ? nextColumn.readOnly(nextRecord)
                  : nextColumn.readOnly;

              if (nextColumn.editable && !isReadOnly) {
                // Focus the next cell
                const cellElement = tableRef.current?.querySelector(
                  `[data-row-index="${nextRowIndex}"][data-column-key="${nextColumn.key}"]`
                ) as HTMLElement;
                cellElement?.focus();
                break;
              }

              nextColumnIndex++;
            }
          } else {
            // Shift+Tab - move to previous cell
            e.preventDefault();
            let prevColumnIndex = currentColumnIndex - 1;
            let prevRowIndex = rowIndex;

            while (prevColumnIndex >= -1 || prevRowIndex > 0) {
              if (prevColumnIndex < 0) {
                prevColumnIndex = columns.length - 1;
                prevRowIndex--;
              }

              if (prevRowIndex < 0) break;

              const prevColumn = columns[prevColumnIndex];
              const prevRecord = data[prevRowIndex];
              const isReadOnly =
                typeof prevColumn.readOnly === 'function'
                  ? prevColumn.readOnly(prevRecord)
                  : prevColumn.readOnly;

              if (prevColumn.editable && !isReadOnly) {
                // Focus the previous cell
                const cellElement = tableRef.current?.querySelector(
                  `[data-row-index="${prevRowIndex}"][data-column-key="${prevColumn.key}"]`
                ) as HTMLElement;
                cellElement?.focus();
                break;
              }

              prevColumnIndex--;
            }
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (rowIndex < data.length - 1) {
            const cellElement = tableRef.current?.querySelector(
              `[data-row-index="${rowIndex + 1}"][data-column-key="${columnKey}"]`
            ) as HTMLElement;
            cellElement?.focus();
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (rowIndex > 0) {
            const cellElement = tableRef.current?.querySelector(
              `[data-row-index="${rowIndex - 1}"][data-column-key="${columnKey}"]`
            ) as HTMLElement;
            cellElement?.focus();
          }
          break;

        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          handleCellSave(rowIndex, columnKey, '');
          break;
      }

      // Global shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    },
    [
      editingCell,
      columns,
      data,
      handleCellClick,
      handleCellSave,
      handleUndo,
      handleRedo,
      createEmptyRow,
      setData,
    ]
  );

  // State for sorting
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey?: React.Key;
    order?: 'ascend' | 'descend';
  }>({});

  const handleTableChange = (
    _pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setSortedInfo({
      columnKey: s.columnKey,
      order: s.order || undefined,
    });
  };

  // Build table columns with custom sorting title
  const tableColumns: ColumnsType<T> = columns.map((col) => {
    const isSorted = sortedInfo.columnKey === col.key;
    const sortOrder = sortedInfo.order;

    // Custom title with sort arrow
    const customTitle = (
      <span
        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
      >
        {col.title}
        {isSorted && sortOrder === 'ascend' && <ArrowUpOutlined />}
        {isSorted && sortOrder === 'descend' && <ArrowDownOutlined />}
      </span>
    );

    return {
      key: col.key,
      title: customTitle,
      dataIndex: col.dataIndex,
      width: col.width,
      // Add sorting to ALL columns
      sorter: (a: T, b: T) => {
        const aVal = String(a[col.dataIndex] || '');
        const bVal = String(b[col.dataIndex] || '');
        return aVal.localeCompare(bVal);
      },
      sortOrder: isSorted ? sortOrder : null,
      showSorterTooltip: false, // Disable tooltip
      // Add filtering - dropdown columns use checkboxes, others (text) use search
      filters:
        col.type === 'dropdown'
          ? // Dropdown: checkbox filters
            Array.from(
              new Set(data.map((item) => String(item[col.dataIndex] || '')))
            )
              .filter((val) => val.trim() !== '' && val !== '-')
              .sort()
              .map((val) => ({ text: val, value: val }))
          : undefined,
      // Text columns: custom search filter (default for non-dropdown)
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
                <Button
                  type="primary"
                  onClick={() => confirm()}
                  icon={<SearchOutlined />}
                  size="small"
                  style={{ width: 90, marginRight: 8 }}
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
            )
          : undefined,
      filterIcon: (filtered: boolean) => (
        <span
          role="img"
          aria-label="filter"
          className="anticon"
          style={{ color: filtered ? '#1890ff' : undefined }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
        </span>
      ),
      onFilter: (value: React.Key | boolean, record: T) => {
        const recordValue = String(record[col.dataIndex] || '').toLowerCase();
        const filterValue = String(value).toLowerCase();
        // Text: search contains, Dropdown: exact match
        return col.type !== 'dropdown'
          ? recordValue.includes(filterValue)
          : recordValue === filterValue;
      },
      onCell: (_: T, rowIndex?: number) => ({
        onClick: (e: React.MouseEvent) => {
          // Single click: just focus the cell (don't open editor)
          if (rowIndex !== undefined) {
            const cellElement = e.currentTarget as HTMLElement;
            cellElement?.focus();
          }
        },
        onDoubleClick: () => {
          // Double click: open editor
          if (rowIndex !== undefined && col.editable) {
            handleCellClick(rowIndex, col.key, col);
          }
        },
      }),
      render: (value: unknown, record: T, index: number) => {
        const isEditing =
          editingCell?.rowIndex === index && editingCell?.columnKey === col.key;
        const cellKey = `${index}-${col.key}`;
        const isHighlighted =
          highlightedCells.has(cellKey) ||
          highlightedCellsInternal.has(cellKey);
        const isReadOnly =
          typeof col.readOnly === 'function'
            ? col.readOnly(record)
            : col.readOnly;

        // Custom render if provided
        if (col.render && !isEditing) {
          return col.render(value, record, index);
        }

        if (isEditing) {
          const options =
            typeof col.options === 'function'
              ? col.options(record)
              : col.options || [];

          // Function to navigate to next editable cell (horizontal)
          const handleNavigateNext = () => {
            // Use latestDataRef to get the most up-to-date data after cell save
            const dataToUse = latestDataRef.current;
            const currentColumnIndex = columns.findIndex(
              (c) => c.key === col.key
            );
            let nextColumnIndex = currentColumnIndex + 1;
            let nextRowIndex = index;

            // Check if we're at the last editable cell of the last row
            // Find the last editable column index
            let lastEditableColumnIndex = -1;
            for (let i = columns.length - 1; i >= 0; i--) {
              if (columns[i].editable) {
                lastEditableColumnIndex = i;
                break;
              }
            }

            const isLastColumn = currentColumnIndex === lastEditableColumnIndex;
            const isLastRow = index === dataToUse.length - 1;

            if (isLastColumn && isLastRow) {
              // Add new row and focus first editable cell
              const newRow = createEmptyRow(dataToUse);
              const newData = [...dataToUse, newRow];
              latestDataRef.current = newData;
              setData(newData);
              setHasChanges(true);

              setTimeout(() => {
                const firstEditableColumn = columns.find((c) => c.editable);
                if (firstEditableColumn) {
                  const cellElement = tableRef.current?.querySelector(
                    `[data-row-index="${dataToUse.length}"][data-column-key="${firstEditableColumn.key}"]`
                  ) as HTMLElement;
                  cellElement?.focus();
                  cellElement?.click();
                }
              }, 150);
              return;
            }

            // Find next editable cell
            while (
              nextColumnIndex < columns.length ||
              nextRowIndex < dataToUse.length - 1
            ) {
              if (nextColumnIndex >= columns.length) {
                nextColumnIndex = 0;
                nextRowIndex++;
              }

              if (nextRowIndex >= dataToUse.length) break;

              const nextColumn = columns[nextColumnIndex];
              const nextRecord = dataToUse[nextRowIndex];
              const isNextReadOnly =
                typeof nextColumn.readOnly === 'function'
                  ? nextColumn.readOnly(nextRecord)
                  : nextColumn.readOnly;

              if (nextColumn.editable && !isNextReadOnly) {
                // Focus the next cell
                setTimeout(() => {
                  const cellElement = tableRef.current?.querySelector(
                    `[data-row-index="${nextRowIndex}"][data-column-key="${nextColumn.key}"]`
                  ) as HTMLElement;
                  cellElement?.focus();
                }, 150);
                break;
              }

              nextColumnIndex++;
            }
          };

          // Function to navigate down to first editable cell of next row
          const handleNavigateDown = () => {
            const nextRowIndex = index + 1;

            // Check if there's a next row
            if (nextRowIndex < data.length) {
              // Find the first editable column in the next row
              for (let colIndex = 0; colIndex < columns.length; colIndex++) {
                const column = columns[colIndex];
                const nextRecord = data[nextRowIndex];
                const isNextReadOnly =
                  typeof column.readOnly === 'function'
                    ? column.readOnly(nextRecord)
                    : column.readOnly;

                // Focus the first editable cell in next row (don't auto-open editor)
                if (column.editable && !isNextReadOnly) {
                  setTimeout(() => {
                    const cellElement = tableRef.current?.querySelector(
                      `[data-row-index="${nextRowIndex}"][data-column-key="${column.key}"]`
                    ) as HTMLElement;
                    cellElement?.focus();
                  }, 150);
                  break;
                }
              }
            }
          };

          // Function to navigate to previous editable cell (backwards)
          const handleNavigatePrevious = () => {
            const dataToUse = latestDataRef.current;
            const currentColumnIndex = columns.findIndex(
              (c) => c.key === col.key
            );
            let prevColumnIndex = currentColumnIndex - 1;
            let prevRowIndex = index;

            // Find previous editable cell
            while (prevColumnIndex >= -1 || prevRowIndex > 0) {
              if (prevColumnIndex < 0) {
                prevColumnIndex = columns.length - 1;
                prevRowIndex--;
              }

              if (prevRowIndex < 0) break;

              const prevColumn = columns[prevColumnIndex];
              const prevRecord = dataToUse[prevRowIndex];
              const isPrevReadOnly =
                typeof prevColumn.readOnly === 'function'
                  ? prevColumn.readOnly(prevRecord)
                  : prevColumn.readOnly;

              if (prevColumn.editable && !isPrevReadOnly) {
                // Focus the previous cell
                setTimeout(() => {
                  const cellElement = tableRef.current?.querySelector(
                    `[data-row-index="${prevRowIndex}"][data-column-key="${prevColumn.key}"]`
                  ) as HTMLElement;
                  cellElement?.focus();
                }, 150);
                break;
              }

              prevColumnIndex--;
            }
          };

          return (
            <EditableCell
              value={String(value || '')}
              onChange={(newValue) => handleCellSave(index, col.key, newValue)}
              onSave={() => setEditingCell(null)}
              onCancel={handleCellCancel}
              onNavigateNext={handleNavigateNext}
              onNavigatePrevious={handleNavigatePrevious}
              onNavigateDown={handleNavigateDown}
              type={col.type}
              options={options}
              readOnly={isReadOnly}
            />
          );
        }

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
  });

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="editable-table-container" ref={tableRef}>
      <div className="editable-table-header">
        {title && <h3>{title}</h3>}
        <div className="editable-table-actions">
          <Button type="default" icon={<PlusOutlined />} onClick={handleAddRow}>
            Add Row
          </Button>
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemoveRows}
            disabled={selectedRowKeys.length === 0}
          >
            Remove Row
          </Button>
          <Button
            type="default"
            icon={<UndoOutlined />}
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            Undo
          </Button>
          <Button
            type="default"
            icon={<RedoOutlined />}
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            Redo
          </Button>
          {showHistory && (
            <Button
              type="default"
              icon={<HistoryOutlined />}
              onClick={onHistoryClick}
              title="View History"
            >
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
        rowSelection={rowSelection}
        pagination={false}
        bordered
        size="small"
        sticky={{ offsetHeader: 0 }}
        onChange={handleTableChange}
      />
    </div>
  );
}
