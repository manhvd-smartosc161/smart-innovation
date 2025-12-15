import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button, message } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import { HotTable, HotTableClass } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import { SYSTEMS, COMPONENTS, MOCK_SCOPE_DATA } from '@/mock';
import type { ScopeItem } from '@/types';
import * as handontableService from '@/services';
import './index.scss';
import type Handsontable from 'handsontable';

registerAllModules();

const LOCAL_STORAGE_KEY = 'scope_tab_data';
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
  const [scopeData, setScopeData] = useState<ScopeItem[]>(() =>
    handontableService.loadDataFromStorage<ScopeItem>(
      LOCAL_STORAGE_KEY,
      MOCK_SCOPE_DATA,
      'scope_id',
      SCOPE_ID_PREFIX,
      SCOPE_ID_LENGTH
    )
  );

  const handsontableRef = useRef<HotTableClass>(null);

  useEffect(() => {
    handontableService.saveDataToStorage(LOCAL_STORAGE_KEY, scopeData);
  }, [scopeData]);

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

      changes.forEach(([visualRow, propertyName, oldValue, newValue]) => {
        const physicalRowIndex = hot.toPhysicalRow(visualRow);

        if (
          physicalRowIndex === null ||
          physicalRowIndex >= updatedData.length
        ) {
          return;
        }

        if (String(oldValue) !== String(newValue)) {
          updatedData[physicalRowIndex] = {
            ...updatedData[physicalRowIndex],
            [propertyName as keyof ScopeItem]: newValue,
          } as ScopeItem;
          hasDataChanged = true;

          if (propertyName === 'component') {
            updatedData[physicalRowIndex].element = '';
          }
        }
      });

      if (hasDataChanged) {
        setScopeData(updatedData);
      }
    },
    [scopeData]
  );

  const handleAddNewRow = useCallback(() => {
    const newRow = createEmptyScopeItem(scopeData);
    const updatedData = [...scopeData, newRow];
    setScopeData(updatedData);

    setTimeout(() => {
      handsontableRef.current?.hotInstance?.selectCell(
        updatedData.length - 1,
        0
      );
      handsontableRef.current?.hotInstance?.scrollViewportTo(
        updatedData.length - 1
      );
    }, 100);
  }, [scopeData]);

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
    selected.forEach((range) => {
      const [startRow, , endRow] = range;
      for (let row = startRow; row <= endRow; row++) {
        rowsToRemove.push(row);
      }
    });

    // Sort in descending order to remove from bottom to top
    rowsToRemove.sort((a, b) => b - a);

    // Remove rows using Handsontable API (this will be tracked by undo/redo)
    rowsToRemove.forEach((rowIndex) => {
      hot.alter('remove_row', rowIndex, 1);
    });

    message.success(`Removed ${rowsToRemove.length} row(s)`);
  }, []);

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

    console.log('Scope data to save:', scopeData);
    message.success(
      `Scope data has been saved successfully! (${scopeData.length} row(s))`
    );
  }, [scopeData]);

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
    [scopeData]
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
            contextMenu={true}
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
    </div>
  );
};
