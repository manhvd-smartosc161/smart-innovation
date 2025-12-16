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
import { MOCK_CHECKLIST_DATA, MOCK_CHECKLIST_HISTORY } from '@/mock';
import type { ChecklistItem, ScopeItem, ImpactItem } from '@/types';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import './index.scss';

registerAllModules();

const STORAGE_KEY = 'checklist_table_data';
const SCOPE_STORAGE_KEY = 'scope_tab_data';
const IMPACT_STORAGE_KEY = 'impact_table_data';

export const ChecklistTab: React.FC = () => {
  const hotTableRef = useRef<HotTableClass>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [data, setData] = useState<ChecklistItem[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        return MOCK_CHECKLIST_DATA;
      }
    }
    return MOCK_CHECKLIST_DATA;
  });

  // Track changed cells since last save
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  // Track cells to highlight after save
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());

  // Load scope and impact data for item dropdown
  const [scopeItems, setScopeItems] = useState<string[]>(() => {
    const scopeData = localStorage.getItem(SCOPE_STORAGE_KEY);
    if (scopeData) {
      try {
        const parsed: ScopeItem[] = JSON.parse(scopeData);
        return parsed.map((item) => item.scope_id);
      } catch (error) {
        console.error('Failed to load scope data:', error);
        return [];
      }
    }
    return [];
  });

  const [impactItems, setImpactItems] = useState<string[]>(() => {
    const impactData = localStorage.getItem(IMPACT_STORAGE_KEY);
    if (impactData) {
      try {
        const parsed: ImpactItem[] = JSON.parse(impactData);
        return parsed.map((item) => item.impact_id);
      } catch (error) {
        console.error('Failed to load impact data:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Listen for changes in scope data
  useEffect(() => {
    const handleStorageChange = () => {
      const scopeData = localStorage.getItem(SCOPE_STORAGE_KEY);
      if (scopeData) {
        try {
          const parsed: ScopeItem[] = JSON.parse(scopeData);
          setScopeItems(parsed.map((item) => item.scope_id));
        } catch (error) {
          console.error('Failed to load scope data:', error);
        }
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for updates in the same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Listen for changes in impact data
  useEffect(() => {
    const handleStorageChange = () => {
      const impactData = localStorage.getItem(IMPACT_STORAGE_KEY);
      if (impactData) {
        try {
          const parsed: ImpactItem[] = JSON.parse(impactData);
          setImpactItems(parsed.map((item) => item.impact_id));
        } catch (error) {
          console.error('Failed to load impact data:', error);
        }
      }
    };

    // Listen for storage events from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    // Also check periodically for updates in the same tab
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

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

  const handleAddRow = useCallback(() => {
    const newRow: ChecklistItem = {
      checklist_id: generateChecklistId(data.length),
      type: '',
      item: '',
      description: '',
    };
    setData([...data, newRow]);

    setTimeout(() => {
      hotTableRef.current?.hotInstance?.selectCell(data.length, 0);
      hotTableRef.current?.hotInstance?.scrollViewportTo(data.length);
    }, 100);
  }, [data]);

  const handleRemoveRow = useCallback(() => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

    const selected = hot.getSelected();
    if (!selected || selected.length === 0) {
      message.warning('Please select at least one row to remove');
      return;
    }

    const rowsToRemove: number[] = [];
    selected.forEach((range) => {
      const [startRow, , endRow] = range;
      for (let row = startRow; row <= endRow; row++) {
        rowsToRemove.push(row);
      }
    });

    rowsToRemove.sort((a, b) => b - a);

    rowsToRemove.forEach((rowIndex) => {
      hot.alter('remove_row', rowIndex, 1);
    });

    message.success(`Removed ${rowsToRemove.length} row(s)`);
  }, []);

  const handleSave = useCallback(() => {
    const validData = data.filter(
      (item) => item.type || item.item || item.description
    );

    if (validData.length === 0) {
      message.warning('Please add at least one row with data before saving.');
      return;
    }

    // Move changed cells to saved cells for highlighting
    setSavedCells(new Set(changedCells));
    // Clear changed cells
    setChangedCells(new Set());

    console.log('Checklist data to save:', validData);
    message.success('Checklist data has been saved successfully!');
  }, [data, changedCells]);

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
            }

            // Reset item and description when type changes
            if (prop === 'type' && String(oldValue) !== String(newValue)) {
              newData[row] = {
                ...newData[row],
                type: (newValue || '') as 'Scope' | 'Impact' | '',
                item: '',
                description: '',
              };
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
      }
    },
    [changedCells]
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
      width: 400,
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

      // Column index 2 corresponds to 'item'
      if (col === 2) {
        const rowData = data[row];
        if (rowData && rowData.type === 'Scope') {
          cellProperties.source = scopeItems;
        } else if (rowData && rowData.type === 'Impact') {
          cellProperties.source = impactItems;
        } else {
          cellProperties.source = [];
        }
      }

      return cellProperties;
    },
    [savedCells, data, scopeItems, impactItems]
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
            contextMenu={{
              items: {
                row_above: {
                  name: 'Insert row above',
                },
                row_below: {
                  name: 'Insert row below',
                },
                remove_row: {
                  name: 'Remove row',
                },
              },
            }}
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
        history={MOCK_CHECKLIST_HISTORY}
        title="Checklist Change History"
      />
    </div>
  );
};
