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
import { SYSTEMS, COMPONENTS } from '@/mock';
import * as handontableService from '@/services';
import { MOCK_IMPACT_DATA } from '@/mock';
import { MOCK_IMPACT_HISTORY } from '@/mock/history';
import type { ImpactItem } from '@/types';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import './index.scss';

registerAllModules();

const STORAGE_KEY = 'impact_table_data';

export const ImpactTab: React.FC = () => {
  const hotTableRef = useRef<HotTableClass>(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [data, setData] = useState<ImpactItem[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Failed to parse saved data:', error);
        return MOCK_IMPACT_DATA;
      }
    }
    return MOCK_IMPACT_DATA;
  });

  // Track changed cells since last save
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  // Track cells to highlight after save
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Re-render table when savedCells changes to apply highlight
  useEffect(() => {
    if (hotTableRef.current?.hotInstance) {
      hotTableRef.current.hotInstance.render();
    }
  }, [savedCells]);

  const generateImpactId = (rowIndex: number): string => {
    const idNumber = (rowIndex + 1).toString().padStart(5, '0');
    return `IMP.${idNumber}`;
  };

  const handleAddRow = () => {
    const newRow: ImpactItem = {
      impact_id: generateImpactId(data.length),
      system: '',
      component: '',
      element: '',
      description: '',
    };
    setData([...data, newRow]);
  };

  const handleRemoveRow = () => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

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
    // This prevents index shifting issues
    rowsToRemove.sort((a, b) => b - a);

    // Remove rows using Handsontable API (this will be tracked by undo/redo)
    rowsToRemove.forEach((rowIndex) => {
      hot.alter('remove_row', rowIndex, 1);
    });

    message.success(`Removed ${rowsToRemove.length} row(s)`);
  };

  const handleSave = useCallback(() => {
    const validData = data.filter(
      (item) =>
        item.system || item.component || item.element || item.description
    );

    if (validData.length === 0) {
      message.warning('Please add at least one row with data before saving.');
      return;
    }

    // Move changed cells to saved cells for highlighting
    setSavedCells(new Set(changedCells));
    // Clear changed cells
    setChangedCells(new Set());

    console.log('Impact data to save:', validData);
    message.success('Impact data has been saved successfully!');
  }, [data, changedCells]);

  const handleUndo = () => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const undoRedo = (hot as any).undoRedo;
    if (undoRedo && undoRedo.isUndoAvailable()) {
      undoRedo.undo();
    } else {
      message.info('No actions to undo');
    }
  };

  const handleRedo = () => {
    const hot = hotTableRef.current?.hotInstance;
    if (!hot) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const undoRedo = (hot as any).undoRedo;
    if (undoRedo && undoRedo.isRedoAvailable()) {
      undoRedo.redo();
    } else {
      message.info('No actions to redo');
    }
  };

  const handleAfterRemoveRow = (
    _index: number,
    _amount: number,
    _physicalRows: number[],
    source?: string
  ) => {
    if (source === 'UndoRedo.undo' || source === 'UndoRedo.redo') {
      // When undoing/redoing, we need to reindex
      const hot = hotTableRef.current?.hotInstance;
      if (!hot) return;

      const currentData = hot.getData() as string[][];
      const reindexedData = currentData.map((row, idx) => ({
        impact_id: generateImpactId(idx),
        system: row[1] || '',
        component: row[2] || '',
        element: row[3] || '',
        description: row[4] || '',
      }));

      setData(reindexedData);
    } else {
      // For normal removal, reindex Impact IDs
      setTimeout(() => {
        const hot = hotTableRef.current?.hotInstance;
        if (!hot) return;

        const currentData = hot.getSourceData() as ImpactItem[];
        const reindexedData = currentData.map((item, idx) => ({
          ...item,
          impact_id: generateImpactId(idx),
        }));

        setData(reindexedData);
      }, 0);
    }
  };

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

            // Reset all columns after system when system changes
            if (prop === 'system' && String(oldValue) !== String(newValue)) {
              newData[row] = {
                ...newData[row],
                system: newValue || '',
                component: '',
                element: '',
                description: '',
              };
              hasChanges = true;
            } else if (
              prop === 'component' &&
              String(oldValue) !== String(newValue)
            ) {
              newData[row] = {
                ...newData[row],
                component: newValue || '',
                element: '',
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
      data: 'impact_id',
      title: 'Impact ID',
      width: 120,
      readOnly: true,
      className: 'htLeft htMiddle',
    },
    {
      data: 'system',
      title: 'System',
      type: 'dropdown',
      source: SYSTEMS.map((s) => s.value),
      width: 150,
      className: 'htLeft htMiddle',
    },
    {
      data: 'component',
      title: 'Component',
      type: 'dropdown',
      source: COMPONENTS.map((c) => c.value),
      width: 150,
      className: 'htLeft htMiddle',
    },
    {
      data: 'element',
      title: 'Element',
      type: 'dropdown',
      source: handontableService.getAllElementDropdownOptions(),
      width: 200,
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

      // Column index 3 corresponds to 'element'
      if (col === 3) {
        const rowData = data[row];
        if (rowData && rowData.component) {
          cellProperties.source =
            handontableService.getElementOptionsByComponent(rowData.component);
        } else {
          cellProperties.source = [];
        }
      }

      return cellProperties;
    },
    [savedCells, data]
  );

  return (
    <div className="impact-tab">
      <div className="impact-content">
        <div className="impact-header">
          <h3>Impact</h3>
          <div className="impact-actions">
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
        history={MOCK_IMPACT_HISTORY}
        title="Impact Change History"
      />
    </div>
  );
};
