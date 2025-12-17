import React, { useState, useCallback, useMemo, useRef } from 'react';
import { message } from 'antd';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { SYSTEMS, COMPONENTS, MOCK_IMPACT_DATA } from '@/mock';
import * as handontableService from '@/services';
import type { ImpactItem } from '@/types';
import {
  HistoryPanel,
  type HistoryItem,
} from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/contexts';
import './index.scss';

const generateImpactId = (rowIndex: number): string => {
  const idNumber = (rowIndex + 1).toString().padStart(5, '0');
  return `IMP.${idNumber}`;
};

const createEmptyImpactItem = (existingData: ImpactItem[]): ImpactItem => {
  return {
    impact_id: generateImpactId(existingData.length),
    system: '',
    component: '',
    element: '',
    description: '',
  };
};

export const Impact: React.FC = () => {
  const { markTabAsSaved } = useAnalysis();
  const [data, setData] = useState<ImpactItem[]>(MOCK_IMPACT_DATA);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  // Track changed cells since last save (for highlighting)
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
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

  const columns: HandsonColumnConfig<ImpactItem>[] = useMemo(
    () => [
      {
        key: 'impact_id',
        title: 'Impact ID',
        dataIndex: 'impact_id',
        width: 120,
        readOnly: true,
      },
      {
        key: 'system',
        title: 'System',
        dataIndex: 'system',
        width: 150,
        editable: true,
        type: 'dropdown',
        options: SYSTEMS.map((s) => s.value),
        onCellChange: (record, value) => {
          if (record.system === value) {
            return { system: value };
          }
          // Reset dependent fields
          return {
            system: value,
            component: '',
            element: '',
            description: '',
          };
        },
      },
      {
        key: 'component',
        title: 'Component',
        dataIndex: 'component',
        width: 150,
        editable: true,
        type: 'dropdown',
        options: COMPONENTS.map((c) => c.value),
        readOnly: (record) => !record.system,
        onCellChange: (record, value) => {
          if (record.component === value) {
            return { component: value };
          }
          // Reset dependent fields
          return {
            component: value,
            element: '',
            description: '',
          };
        },
      },
      {
        key: 'element',
        title: 'Element',
        dataIndex: 'element',
        width: 150,
        editable: true,
        type: 'dropdown',
        options: (record) => {
          return record.component
            ? handontableService.getElementOptionsByComponent(record.component)
            : [];
        },
        readOnly: (record) => !record.component,
        onCellChange: (record, value) => {
          if (record.element === value) {
            return { element: value };
          }
          // Reset dependent fields
          return {
            element: value,
            description: '',
          };
        },
      },
      {
        key: 'description',
        title: 'Description',
        dataIndex: 'description',
        width: 300,
        editable: true,
        type: 'text',
        readOnly: (record) => !record.element,
        // No dependent fields to reset
      },
    ],
    []
  );

  const handleDataChange = useCallback(
    (newData: ImpactItem[]) => {
      // Re-index IDs if necessary
      const reindexedData = newData.map((item, index) => ({
        ...item,
        impact_id: generateImpactId(index),
      }));

      // Detect all changes (including cascading resets) for highlighting
      if (data.length === reindexedData.length) {
        const newChangedCells = new Set(changedCells);
        let hasChanges = false;

        reindexedData.forEach((newItem, index) => {
          const oldItem = data[index];
          (['system', 'component', 'element', 'description'] as const).forEach(
            (key) => {
              if (newItem[key] !== oldItem[key]) {
                newChangedCells.add(`${index}-${key}`);
                hasChanges = true;
              }
            }
          );
        });

        if (hasChanges) {
          setChangedCells(newChangedCells);
        }
      }

      setData(reindexedData);
    },
    [data, changedCells]
  );

  const handleRowAdd = useCallback((newRow: ImpactItem) => {
    pendingChangesRef.current.added.push(newRow.impact_id);
  }, []);

  const handleRowDelete = useCallback((deletedRows: ImpactItem[]) => {
    const deletedIds = deletedRows.map((r) => r.impact_id);
    pendingChangesRef.current.deleted.push(...deletedIds);
  }, []);

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: ImpactItem
    ) => {
      const itemId = record.impact_id;
      const columnTitle =
        columns.find((col) => col.key === columnKey)?.title || columnKey;

      pendingChangesRef.current.edited.push({
        itemId,
        row: rowIndex,
        column: columnTitle as string,
        oldValue,
        newValue,
      });

      // Track changed cell
      const cellKey = `${rowIndex}-${columnKey}`;
      setChangedCells((prev) => new Set(prev).add(cellKey));
    },
    [columns]
  );

  const handleSave = useCallback(
    (dataToSave: ImpactItem[]) => {
      const validData = dataToSave.filter(
        (item) =>
          item.system || item.component || item.element || item.description
      );

      if (validData.length === 0) {
        message.warning('Please add at least one row with data before saving.');
        return;
      }

      const pending = pendingChangesRef.current;
      const newHistoryItems: HistoryItem[] = [];

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

      pending.added.forEach((itemId) => {
        newHistoryItems.push(createHistoryItem('add', `Added ${itemId}`));
      });

      const editMap = new Map<string, (typeof pending.edited)[0]>();
      pending.edited.forEach((edit) => {
        const key = `${edit.itemId}-${edit.column}`;
        editMap.set(key, edit);
      });

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

      if (pending.deleted.length > 0) {
        const description =
          pending.deleted.length === 1
            ? `Deleted ${pending.deleted[0]}`
            : `Deleted ${pending.deleted.length} rows: ${pending.deleted.join(', ')}`;
        newHistoryItems.push(createHistoryItem('delete', description));
      }

      setHistory((prev) => [...newHistoryItems, ...prev]);

      pendingChangesRef.current = {
        added: [],
        edited: [],
        deleted: [],
      };

      setSavedCells((prev) => {
        const newSaved = new Set(prev);
        changedCells.forEach((cell) => newSaved.add(cell));

        // Identify added rows and mark all their cells as saved/highlighted
        const addedIds = new Set(pending.added);
        if (addedIds.size > 0) {
          dataToSave.forEach((row, rowIndex) => {
            if (addedIds.has(row.impact_id)) {
              newSaved.add(`${rowIndex}-system`);
              newSaved.add(`${rowIndex}-component`);
              newSaved.add(`${rowIndex}-element`);
              newSaved.add(`${rowIndex}-description`);
            }
          });
        }
        return newSaved;
      });
      setChangedCells(new Set());

      markTabAsSaved('Impact');

      console.log('Impact data to save:', validData);
    },
    [changedCells, markTabAsSaved]
  );

  return (
    <div className="impact-tab">
      <div className="impact-content">
        <HandsonTable
          title="Impact"
          columns={columns}
          dataSource={data}
          onDataChange={handleDataChange}
          onSave={handleSave}
          onCellEdit={handleCellEdit}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          createEmptyRow={createEmptyImpactItem}
          showHistory={true}
          onHistoryClick={() => setHistoryVisible(true)}
          highlightedCells={savedCells}
        />
      </div>
      <HistoryPanel
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title="Impact Change History"
      />
    </div>
  );
};
