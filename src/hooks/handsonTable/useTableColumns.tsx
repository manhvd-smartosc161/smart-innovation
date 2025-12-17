import React, { useMemo } from 'react';
import { Button, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  SearchOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';
import { HandsonCell as HandsonCellComponent } from '@/components/molecules/HandsonCell';
import type {
  HandsonColumnConfig,
  HandsonCellState,
  SortedInfo,
} from '@/types/handsonTable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface UseTableColumnsProps<T extends Record<string, any>> {
  columns: HandsonColumnConfig<T>[];
  data: T[];
  sortedInfo: SortedInfo;
  editingCell: HandsonCellState | null;
  highlightedCells: Set<string>;
  highlightedCellsInternal: Set<string>;
  handleCellClick: (
    rowIndex: number,
    columnKey: string,
    column: HandsonColumnConfig<T>
  ) => void;
  handleCellSave: (rowIndex: number, columnKey: string, value: string) => void;
  handleCellCancel: () => void;
  handleKeyDown: (
    e: React.KeyboardEvent,
    rowIndex: number,
    columnKey: string
  ) => void;
  navigateCell: (
    rowIndex: number,
    columnKey: string,
    direction: 'next' | 'prev' | 'down'
  ) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useTableColumns<T extends Record<string, any>>({
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
}: UseTableColumnsProps<T>): ColumnsType<T> {
  return useMemo(
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
          onFilter: (value, record) => {
            const cellValue = String(record[col.dataIndex] || '').toLowerCase();
            const filterValue = String(value).toLowerCase();

            if (col.type === 'dropdown') {
              return cellValue === filterValue;
            } else {
              return cellValue.includes(filterValue);
            }
          },
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
            onClick: (e) => {
              if (rowIndex === undefined) return;
              (e.currentTarget as HTMLElement).focus();
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
                <HandsonCellComponent
                  value={String(value || '')}
                  onChange={(v) => handleCellSave(index, col.key, v)}
                  onSave={() => handleCellCancel()}
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
                className={`handson-table-cell ${isHighlighted ? 'cell-highlighted' : ''} ${col.type === 'dropdown' ? 'has-dropdown' : ''}`}
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
    ]
  );
}
