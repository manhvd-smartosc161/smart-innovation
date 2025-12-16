import React, { useState, useRef, useEffect, useCallback } from 'react';
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
import 'handsontable/dist/handsontable.full.css';
import { SYSTEMS, COMPONENTS, MOCK_SCOPE_DATA } from '@/mock';
import type { ScopeItem } from '@/types';
import * as handontableService from '@/services';
import {
  HistoryPanel,
  type HistoryItem,
} from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/contexts';
import { TAB_KEYS } from '@/constants';
import './index.scss';
import type Handsontable from 'handsontable';

registerAllModules();

const SCOPE_ID_PREFIX = 'SCO.';
const SCOPE_ID_LENGTH = 5;

const COLUMN_INDEX = {
  SCOPE_ID: 0,
  SYSTEM: 1,
  COMPONENT: 2,
  ELEMENT: 3,
  DESCRIPTION: 4,
} as const;

const COLUMN_HEADERS = [
  'Scope ID',
  'System',
  'Component',
  'Element',
  'Description',
];

const COLUMN_WIDTHS = {
  SCOPE_ID: 120,
  SYSTEM: 150,
  COMPONENT: 150,
  ELEMENT: 150,
  DESCRIPTION: 300,
} as const;

const systemDropdownOptions = SYSTEMS.map((s) => s.value);
const componentDropdownOptions = COMPONENTS.map((c) => c.value);
const allElementDropdownOptions =
  handontableService.getAllElementDropdownOptions();

const createEmptyScopeItem = (existingData: ScopeItem[]): ScopeItem => {
  return {
    scope_id: handontableService.generateNextId(
      existingData,
      'scope_id',
      SCOPE_ID_PREFIX,
      SCOPE_ID_LENGTH
    ),
    system: '',
    component: '',
    element: '',
    description: '',
  };
};

const getHandsontableColumnConfig = (
  columnIndex: number
): Handsontable.ColumnSettings => {
  switch (columnIndex) {
    case COLUMN_INDEX.SCOPE_ID:
      return handontableService.createColumnConfig(columnIndex, {
        data: 'scope_id',
        type: 'text',
        width: COLUMN_WIDTHS.SCOPE_ID,
        readOnly: true,
      });

    case COLUMN_INDEX.SYSTEM:
      return handontableService.createColumnConfig(columnIndex, {
        data: 'system',
        type: 'dropdown',
        width: COLUMN_WIDTHS.SYSTEM,
        source: systemDropdownOptions,
      });

    case COLUMN_INDEX.COMPONENT:
      return handontableService.createColumnConfig(columnIndex, {
        data: 'component',
        type: 'dropdown',
        width: COLUMN_WIDTHS.COMPONENT,
        source: componentDropdownOptions,
      });

    case COLUMN_INDEX.ELEMENT:
      return handontableService.createColumnConfig(columnIndex, {
        data: 'element',
        type: 'dropdown',
        width: COLUMN_WIDTHS.ELEMENT,
        source: allElementDropdownOptions,
      });

    case COLUMN_INDEX.DESCRIPTION:
      return handontableService.createColumnConfig(columnIndex, {
        data: 'description',
        type: 'text',
        width: COLUMN_WIDTHS.DESCRIPTION,
      });

    default:
      return {};
  }
};

export const ScopeTab: React.FC = () => {
  const { markTabAsChanged, markTabAsSaved } = useAnalysis();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [scopeData, setScopeData] = useState<ScopeItem[]>(MOCK_SCOPE_DATA);

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

  const handsontableRef = useRef<HotTableClass>(null);

  useEffect(() => {
    if (handsontableRef.current) {
      handsontableRef.current.render();
    }
  }, [scopeData]);

  useEffect(() => {
    const updateElementDropdowns = () => {
      const hotTable = handsontableRef.current;
      if (!hotTable?.hotInstance) return;

      handontableService.updateDynamicDropdownOptions(
        hotTable.hotInstance,
        scopeData,
        COLUMN_INDEX.ELEMENT,
        handontableService.getElementOptionsByComponent
      );
    };

    const timer = setTimeout(updateElementDropdowns, 0);
    return () => clearTimeout(timer);
  }, [scopeData]);

  // Re-render table when savedCells changes to apply highlight
  useEffect(() => {
    if (handsontableRef.current?.hotInstance) {
      handsontableRef.current.hotInstance.render();
    }
  }, [savedCells]);

  const handleCellValueChange = useCallback(
    (
      changes: Handsontable.CellChange[] | null,
      source: Handsontable.ChangeSource
    ) => {
      if (source === 'loadData' || !changes) {
        return;
      }

      const hot = handsontableRef.current?.hotInstance;
      if (!hot) return;

      let hasDataChanged = false;
      const updatedData = [...scopeData];
      const newChangedCells = new Set(changedCells);

      // Map property names to column indices
      const propertyToColumnIndex: Record<string, number> = {
        scope_id: COLUMN_INDEX.SCOPE_ID,
        system: COLUMN_INDEX.SYSTEM,
        component: COLUMN_INDEX.COMPONENT,
        element: COLUMN_INDEX.ELEMENT,
        description: COLUMN_INDEX.DESCRIPTION,
      };

      changes.forEach(([visualRow, propertyName, oldValue, newValue]) => {
        const physicalRowIndex = hot.toPhysicalRow(visualRow);

        if (
          physicalRowIndex === null ||
          physicalRowIndex >= updatedData.length
        ) {
          return;
        }

        if (String(oldValue) !== String(newValue)) {
          // Track the changed cell
          const columnIndex = propertyToColumnIndex[propertyName as string];
          if (columnIndex !== undefined) {
            const cellKey = `${physicalRowIndex}-${columnIndex}`;
            newChangedCells.add(cellKey);
          }

          // Track pending edit (skip for empty initial values)
          if (oldValue !== null && oldValue !== undefined && oldValue !== '') {
            const itemId = updatedData[physicalRowIndex].scope_id;
            const columnName =
              String(propertyName).charAt(0).toUpperCase() +
              String(propertyName).slice(1);
            pendingChangesRef.current.edited.push({
              itemId,
              row: physicalRowIndex,
              column: columnName,
              oldValue: String(oldValue),
              newValue: String(newValue),
            });
          }

          // Reset all columns after system when system changes
          if (propertyName === 'system') {
            updatedData[physicalRowIndex] = {
              ...updatedData[physicalRowIndex],
              system: newValue,
              component: '',
              element: '',
              description: '',
            } as ScopeItem;
            // Track reset cells as changed
            newChangedCells.add(
              `${physicalRowIndex}-${COLUMN_INDEX.COMPONENT}`
            );
            newChangedCells.add(`${physicalRowIndex}-${COLUMN_INDEX.ELEMENT}`);
            newChangedCells.add(
              `${physicalRowIndex}-${COLUMN_INDEX.DESCRIPTION}`
            );
          } else if (propertyName === 'component') {
            // Reset element and description when component changes
            updatedData[physicalRowIndex] = {
              ...updatedData[physicalRowIndex],
              component: newValue,
              element: '',
              description: '',
            } as ScopeItem;
            // Track reset cells as changed
            newChangedCells.add(`${physicalRowIndex}-${COLUMN_INDEX.ELEMENT}`);
            newChangedCells.add(
              `${physicalRowIndex}-${COLUMN_INDEX.DESCRIPTION}`
            );
          } else if (propertyName === 'element') {
            // Reset description when element changes
            updatedData[physicalRowIndex] = {
              ...updatedData[physicalRowIndex],
              element: newValue,
              description: '',
            } as ScopeItem;
            // Track reset cell as changed
            newChangedCells.add(
              `${physicalRowIndex}-${COLUMN_INDEX.DESCRIPTION}`
            );
          } else {
            updatedData[physicalRowIndex] = {
              ...updatedData[physicalRowIndex],
              [propertyName as keyof ScopeItem]: newValue,
            } as ScopeItem;
          }

          hasDataChanged = true;
        }
      });

      if (hasDataChanged) {
        setScopeData(updatedData);
        setChangedCells(newChangedCells);
        markTabAsChanged(TAB_KEYS.SCOPE);
      }
    },
    [scopeData, changedCells, markTabAsChanged]
  );

  const handleAddNewRow = useCallback(() => {
    const newRow = createEmptyScopeItem(scopeData);
    const updatedData = [...scopeData, newRow];
    setScopeData(updatedData);

    // Track pending add (will be committed on save)
    pendingChangesRef.current.added.push(newRow.scope_id);
    markTabAsChanged(TAB_KEYS.SCOPE);

    setTimeout(() => {
      handsontableRef.current?.hotInstance?.selectCell(
        updatedData.length - 1,
        0
      );
      handsontableRef.current?.hotInstance?.scrollViewportTo(
        updatedData.length - 1
      );
    }, 100);
  }, [scopeData, markTabAsChanged]);

  const handleRemoveSelectedRows = useCallback(() => {
    const hotTable = handsontableRef.current;

    if (!hotTable?.hotInstance) {
      message.warning('Table not initialized');
      return;
    }

    const hot = hotTable.hotInstance;
    const selected = hot.getSelected();

    if (!selected || selected.length === 0) {
      message.warning('Please select at least one row to remove');
      return;
    }

    // Collect all selected row indices
    const rowsToRemove: number[] = [];
    const deletedIds: string[] = [];

    selected.forEach((range) => {
      const [startRow, , endRow] = range;
      for (let row = startRow; row <= endRow; row++) {
        rowsToRemove.push(row);
        // Get the scope_id before removing
        if (scopeData[row]) {
          deletedIds.push(scopeData[row].scope_id);
        }
      }
    });

    // Sort in descending order to remove from bottom to top
    rowsToRemove.sort((a, b) => b - a);

    // Remove rows using Handsontable API (this will be tracked by undo/redo)
    rowsToRemove.forEach((rowIndex) => {
      hot.alter('remove_row', rowIndex, 1);
    });

    // Track pending delete (will be committed on save)
    pendingChangesRef.current.deleted.push(...deletedIds);
    markTabAsChanged(TAB_KEYS.SCOPE);

    message.success(`Removed ${rowsToRemove.length} row(s)`);
  }, [scopeData, markTabAsChanged]);

  const handleAfterRemoveRow = useCallback(
    (
      _index: number,
      _amount: number,
      _physicalRows: number[],
      source?: string
    ) => {
      if (source === 'UndoRedo.undo' || source === 'UndoRedo.redo') {
        // When undoing/redoing, we need to reindex
        const hot = handsontableRef.current?.hotInstance;
        if (!hot) return;

        const currentData = hot.getData() as string[][];
        const reindexedData = currentData.map((row, idx) => ({
          scope_id: handontableService.generateNextId(
            currentData.slice(0, idx) as unknown as ScopeItem[],
            'scope_id',
            SCOPE_ID_PREFIX,
            SCOPE_ID_LENGTH
          ),
          system: row[1] || '',
          component: row[2] || '',
          element: row[3] || '',
          description: row[4] || '',
        }));

        setScopeData(reindexedData);
      } else {
        // For normal removal, reindex Scope IDs
        setTimeout(() => {
          const hot = handsontableRef.current?.hotInstance;
          if (!hot) return;

          const currentData = hot.getSourceData() as ScopeItem[];
          const reindexedData = currentData.map((item, idx) => ({
            ...item,
            scope_id: `${SCOPE_ID_PREFIX}${String(idx + 1).padStart(SCOPE_ID_LENGTH, '0')}`,
          }));

          setScopeData(reindexedData);
        }, 0);
      }
    },
    []
  );

  const handleSaveData = useCallback(() => {
    if (scopeData.length === 0) {
      message.warning('Please add at least one row before saving.');
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
    markTabAsSaved(TAB_KEYS.SCOPE);

    console.log('Scope data to save:', scopeData);
    message.success(`Scope data has been saved successfully!`);
  }, [scopeData, changedCells, markTabAsSaved]);

  const handleUndo = useCallback(() => {
    const hot = handsontableRef.current?.hotInstance;
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
    const hot = handsontableRef.current?.hotInstance;
    if (!hot) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const undoRedo = (hot as any).undoRedo;
    if (undoRedo && undoRedo.isRedoAvailable()) {
      undoRedo.redo();
    } else {
      message.info('No actions to redo');
    }
  }, []);

  const handleBeforeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const handler = handontableService.createTabKeyHandler(
        handsontableRef.current?.hotInstance,
        scopeData,
        COLUMN_HEADERS.length,
        createEmptyScopeItem,
        setScopeData
      );
      handler(event);
    },
    [scopeData]
  );

  const getHandsontableCellProperties = useCallback(
    (
      rowIndex: number,
      columnIndex: number
    ): Partial<Handsontable.CellProperties> => {
      const cellProperties: Partial<Handsontable.CellProperties> = {};

      // Apply highlight to saved cells
      const cellKey = `${rowIndex}-${columnIndex}`;
      if (savedCells.has(cellKey)) {
        cellProperties.className = 'saved-cell-highlight';
      }

      if (columnIndex === COLUMN_INDEX.ELEMENT && scopeData[rowIndex]) {
        const selectedComponent = scopeData[rowIndex].component;

        if (selectedComponent) {
          cellProperties.source =
            handontableService.getElementOptionsByComponent(selectedComponent);
          cellProperties.readOnly = false;
        } else {
          cellProperties.source = [];
          cellProperties.readOnly = true;
        }
      }

      return cellProperties;
    },
    [scopeData, savedCells]
  );

  return (
    <div className="scope-tab">
      <div className="scope-content">
        <div className="scope-header">
          <h3>Scope</h3>
          <div className="scope-actions">
            <Button
              type="default"
              icon={<PlusOutlined />}
              onClick={handleAddNewRow}
            >
              Add Row
            </Button>
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              onMouseDown={(e) => {
                e.preventDefault();
                handleRemoveSelectedRows();
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
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSaveData}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="hot-table-wrapper">
          <HotTable
            ref={handsontableRef}
            data={scopeData}
            rowHeaders={true}
            colHeaders={COLUMN_HEADERS}
            width="100%"
            height="auto"
            licenseKey="non-commercial-and-evaluation"
            stretchH="all"
            contextMenu={[
              'row_above',
              'row_below',
              'remove_row',
              '---------',
              'cut',
              'copy',
            ]}
            columnSorting={true}
            filters={true}
            dropdownMenu={[
              'col_left',
              'col_right',
              'filter_by_condition',
              'filter_by_value',
              'filter_action_bar',
              '---------',
            ]}
            manualRowMove={true}
            manualColumnMove={true}
            afterChange={handleCellValueChange}
            afterRemoveRow={handleAfterRemoveRow}
            beforeKeyDown={handleBeforeKeyDown}
            allowInsertRow={true}
            allowRemoveRow={true}
            manualRowResize={true}
            manualColumnResize={true}
            renderAllRows={false}
            viewportRowRenderingOffset={30}
            viewportColumnRenderingOffset={10}
            columns={getHandsontableColumnConfig}
            cells={getHandsontableCellProperties}
            undo={true}
          />
        </div>
      </div>
      <HistoryPanel
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title="Scope Change History"
      />
    </div>
  );
};
