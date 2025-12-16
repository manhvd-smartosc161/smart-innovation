import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button, message } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
  HistoryOutlined,
} from '@ant-design/icons';
import { HotTable, HotTableClass } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import type { CellChange } from 'handsontable/common';
import 'handsontable/dist/handsontable.full.css';
import { MOCK_CHECKLIST_DATA } from '@/mock';
import type { ChecklistItem } from '@/types';
import * as handontableService from '@/services';
import {
  HistoryPanel,
  type HistoryItem,
} from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/contexts';
import { TAB_KEYS } from '@/constants';
import './index.scss';

registerAllModules();

export const ChecklistTab: React.FC = () => {
  const { markTabAsChanged, markTabAsSaved } = useAnalysis();
  const hotTableRef = useRef<HotTableClass>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [data, setData] = useState<ChecklistItem[]>(MOCK_CHECKLIST_DATA);

  // Track changed cells since last save
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  // Track cells to highlight after save
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());

  // Track pending changes to commit to history on save
  const pendingChangesRef = useRef<{
    added: string[];
    edited: Array<{
      itemId: string;
      row: number;
      column: string;
      oldValue: string;
      newValue: string;
    }>;
    deleted: string[];
  }>({
    added: [],
    edited: [],
    deleted: [],
  });

  // Re-render table when savedCells changes to apply highlight
  useEffect(() => {
    if (hotTableRef.current?.hotInstance) {
      hotTableRef.current.hotInstance.render();
    }
  }, [savedCells]);

  const generateChecklistId = (rowIndex: number): string => {
    const idNumber = (rowIndex + 1).toString().padStart(5, '0');
    return `CL.${idNumber}`;
  };

  const createEmptyChecklistItem = (
    existingData: ChecklistItem[]
  ): ChecklistItem => {
    return {
      checklist_id: generateChecklistId(existingData.length),
      type: '',
      item: '',
      description: '',
    };
  };

  const handleAddRow = useCallback(() => {
    const newRow: ChecklistItem = {
      checklist_id: generateChecklistId(data.length),
      type: '',
      item: '',
      description: '',
    };
    setData([...data, newRow]);

    // Track pending add (will be committed on save)
    pendingChangesRef.current.added.push(newRow.checklist_id);
    markTabAsChanged(TAB_KEYS.CHECKLIST);

    setTimeout(() => {
      hotTableRef.current?.hotInstance?.selectCell(data.length, 0);
      hotTableRef.current?.hotInstance?.scrollViewportTo(data.length);
    }, 100);
  }, [data, markTabAsChanged]);

  const handleRemoveRow = useCallback(() => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

    const selected = hot.getSelected();
    if (!selected || selected.length === 0) {
      message.warning('Please select at least one row to remove');
      return;
    }

    const rowsToRemove: number[] = [];
    const deletedIds: string[] = [];

    selected.forEach((range) => {
      const [startRow, , endRow] = range;
      for (let row = startRow; row <= endRow; row++) {
        rowsToRemove.push(row);
        // Get the checklist_id before removing
        if (data[row]) {
          deletedIds.push(data[row].checklist_id);
        }
      }
    });

    rowsToRemove.sort((a, b) => b - a);

    rowsToRemove.forEach((rowIndex) => {
      hot.alter('remove_row', rowIndex, 1);
    });

    // Track pending delete (will be committed on save)
    pendingChangesRef.current.deleted.push(...deletedIds);
    markTabAsChanged(TAB_KEYS.CHECKLIST);

    message.success(`Removed ${rowsToRemove.length} row(s)`);
  }, [data, markTabAsChanged]);

  const handleSave = useCallback(() => {
    const validData = data.filter(
      (item) => item.type || item.item || item.description
    );

    if (validData.length === 0) {
      message.warning('Please add at least one row with data before saving.');
      return;
    }

    // Commit all pending changes to history
    const pending = pendingChangesRef.current;
    const newHistoryItems: HistoryItem[] = [];

    // Helper to create history item
    const createHistoryItem = (
      action: 'add' | 'edit' | 'delete',
      description: string,
      cell?: HistoryItem['cell']
    ): HistoryItem => ({
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user: { name: 'Mạnh Vũ Duy (KO)', avatar: undefined },
      timestamp: new Date(),
      action,
      description,
      cell,
    });

    // Log added items
    pending.added.forEach((itemId) => {
      newHistoryItems.push(createHistoryItem('add', `Added ${itemId}`));
    });

    // Deduplicate edited items - keep only the last edit for each itemId+column
    const editMap = new Map<string, (typeof pending.edited)[0]>();
    pending.edited.forEach((edit) => {
      const key = `${edit.itemId}-${edit.column}`;
      editMap.set(key, edit);
    });

    // Log deduplicated edited items
    editMap.forEach(({ itemId, row, column, oldValue, newValue }) => {
      newHistoryItems.push(
        createHistoryItem('edit', `Updated ${column} in ${itemId}`, {
          row,
          itemId,
          column,
          oldValue,
          newValue,
        })
      );
    });

    // Log deleted items
    if (pending.deleted.length > 0) {
      const description =
        pending.deleted.length === 1
          ? `Deleted ${pending.deleted[0]}`
          : `Deleted ${pending.deleted.length} rows: ${pending.deleted.join(', ')}`;
      newHistoryItems.push(createHistoryItem('delete', description));
    }

    // Update history (prepend new items)
    setHistory((prev) => [...newHistoryItems, ...prev]);

    // Clear pending changes
    pendingChangesRef.current = {
      added: [],
      edited: [],
      deleted: [],
    };

    // Move changed cells to saved cells for highlighting
    setSavedCells(new Set(changedCells));
    // Clear changed cells
    setChangedCells(new Set());

    // Mark tab as saved
    markTabAsSaved(TAB_KEYS.CHECKLIST);

    console.log('Checklist data to save:', validData);
    message.success('Checklist data has been saved successfully!');
  }, [data, changedCells, markTabAsSaved]);

  const handleUndo = useCallback(() => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const undoRedo = (hot as any).undoRedo;
    if (undoRedo && undoRedo.isUndoAvailable()) {
      undoRedo.undo();
    } else {
      message.info('No actions to undo');
    }
  }, []);

  const handleRedo = useCallback(() => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const undoRedo = (hot as any).undoRedo;
    if (undoRedo && undoRedo.isRedoAvailable()) {
      undoRedo.redo();
    } else {
      message.info('No actions to redo');
    }
  }, []);

  const handleAfterRemoveRow = useCallback(
    (
      _index: number,
      _amount: number,
      _physicalRows: number[],
      source?: string
    ) => {
      if (source === 'UndoRedo.undo' || source === 'UndoRedo.redo') {
        const hot = hotTableRef.current?.hotInstance;
        if (!hot) return;

        const currentData = hot.getData() as string[][];
        const reindexedData = currentData.map((row, idx) => ({
          checklist_id: generateChecklistId(idx),
          type: (row[1] || '') as 'Scope' | 'Impact' | '',
          item: row[2] || '',
          description: row[3] || '',
        }));

        setData(reindexedData);
      } else {
        setTimeout(() => {
          const hot = hotTableRef.current?.hotInstance;
          if (!hot) return;

          const currentData = hot.getSourceData() as ChecklistItem[];
          const reindexedData = currentData.map((item, idx) => ({
            ...item,
            checklist_id: generateChecklistId(idx),
          }));

          setData(reindexedData);
        }, 0);
      }
    },
    []
  );

  const handleAfterChange = useCallback(
    (changes: CellChange[] | null, source: string) => {
      if (!changes || source === 'loadData') return;

      const hot = hotTableRef.current?.hotInstance;
      if (!hot) return;

      const newChangedCells = new Set(changedCells);
      let shouldUpdateChangedCells = false;

      setData((prevData) => {
        const newData = [...prevData];
        let hasChanges = false;

        changes.forEach(([row, prop, oldValue, newValue]) => {
          if (row < newData.length) {
            // Track changed cell
            if (String(oldValue) !== String(newValue)) {
              const colIndex = hot.propToCol(prop as string);
              if (colIndex !== null && colIndex !== undefined) {
                const cellKey = `${row}-${colIndex}`;
                newChangedCells.add(cellKey);
                shouldUpdateChangedCells = true;
              }

              // Track pending edit (skip for empty initial values)
              if (
                oldValue !== null &&
                oldValue !== undefined &&
                oldValue !== ''
              ) {
                const itemId = newData[row].checklist_id;
                const columnName =
                  String(prop).charAt(0).toUpperCase() + String(prop).slice(1);
                pendingChangesRef.current.edited.push({
                  itemId,
                  row,
                  column: columnName,
                  oldValue: String(oldValue),
                  newValue: String(newValue),
                });
              }
            }

            // Reset item and description when type changes
            if (prop === 'type' && String(oldValue) !== String(newValue)) {
              newData[row] = {
                ...newData[row],
                type: (newValue || '') as 'Scope' | 'Impact' | '',
                item: '',
                description: '',
              };
              // Track reset cells as changed
              const itemCol = hot.propToCol('item');
              const descCol = hot.propToCol('description');
              if (itemCol !== null) newChangedCells.add(`${row}-${itemCol}`);
              if (descCol !== null) newChangedCells.add(`${row}-${descCol}`);
              shouldUpdateChangedCells = true;
              hasChanges = true;
            } else if (
              prop === 'item' &&
              String(oldValue) !== String(newValue)
            ) {
              // Reset description when item changes
              newData[row] = {
                ...newData[row],
                item: newValue || '',
                description: '',
              };
              // Track reset cell as changed
              const descCol = hot.propToCol('description');
              if (descCol !== null) newChangedCells.add(`${row}-${descCol}`);
              shouldUpdateChangedCells = true;
              hasChanges = true;
            } else if (
              typeof prop === 'string' &&
              String(oldValue) !== String(newValue)
            ) {
              newData[row] = {
                ...newData[row],
                [prop]: newValue || '',
              };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? newData : prevData;
      });

      if (shouldUpdateChangedCells) {
        setChangedCells(newChangedCells);
        markTabAsChanged(TAB_KEYS.CHECKLIST);
      }
    },
    [data, changedCells, markTabAsChanged]
  );

  const columns = [
    {
      data: 'checklist_id',
      title: 'Checklist ID',
      width: 120,
      readOnly: true,
      className: 'htLeft htMiddle',
    },
    {
      data: 'type',
      title: 'Type',
      type: 'dropdown',
      source: ['Scope', 'Impact'],
      width: 120,
      className: 'htLeft htMiddle',
    },
    {
      data: 'item',
      title: 'Item',
      type: 'dropdown',
      source: [], // Will be set dynamically in getCellProperties
      width: 150,
      className: 'htLeft htMiddle',
    },
    {
      data: 'description',
      title: 'Description',
      type: 'text',
      width: 300,
      className: 'htLeft htMiddle',
    },
  ];

  const getCellProperties = useCallback(
    (row: number, col: number) => {
      const cellKey = `${row}-${col}`;
      const cellProperties: Record<string, unknown> = {};

      if (savedCells.has(cellKey)) {
        cellProperties.className = 'saved-cell-highlight';
      }

      // Column index 2 corresponds to 'item' - empty source for now
      if (col === 2) {
        cellProperties.source = [];
      }

      return cellProperties;
    },
    [savedCells, data]
  );

  const handleBeforeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const handler = handontableService.createTabKeyHandler(
        hotTableRef.current?.hotInstance,
        data,
        columns.length,
        createEmptyChecklistItem,
        setData
      );
      handler(event);
    },
    [data, columns.length]
  );

  return (
    <div className="checklist-tab">
      <div className="checklist-content">
        <div className="checklist-header">
          <h3>Checklist</h3>
          <div className="checklist-actions">
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={handleAddRow}
            >
              Add Row
            </Button>
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onMouseDown={(e) => {
                e.preventDefault();
                handleRemoveRow();
              }}
            >
              Remove Row
            </Button>
            <Button
              type="default"
              icon={<UndoOutlined />}
              onClick={handleUndo}
              title="Undo (Ctrl+Z)"
            >
              Undo
            </Button>
            <Button
              type="default"
              icon={<RedoOutlined />}
              onClick={handleRedo}
              title="Redo (Ctrl+Y)"
            >
              Redo
            </Button>
            <Button
              type="default"
              icon={<HistoryOutlined />}
              onClick={() => setHistoryVisible(true)}
              title="View History"
            >
              History
            </Button>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
        <div className="hot-table-wrapper">
          <HotTable
            ref={hotTableRef}
            data={data}
            colHeaders={true}
            rowHeaders={true}
            columns={columns}
            cells={getCellProperties}
            width="100%"
            height="auto"
            licenseKey="non-commercial-and-evaluation"
            afterChange={handleAfterChange}
            afterRemoveRow={handleAfterRemoveRow}
            beforeKeyDown={handleBeforeKeyDown}
            contextMenu={[
              'row_above',
              'row_below',
              'remove_row',
              '---------',
              'cut',
              'copy',
            ]}
            dropdownMenu={[
              'filter_by_condition',
              'filter_by_value',
              'filter_action_bar',
            ]}
            filters={true}
            columnSorting={true}
            manualColumnResize={true}
            autoWrapRow={true}
            autoWrapCol={true}
            stretchH="all"
            undo={true}
          />
        </div>
      </div>
      <HistoryPanel
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title="Checklist Change History"
      />
    </div>
  );
};
