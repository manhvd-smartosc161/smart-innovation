import React, { useState, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { SYSTEMS, COMPONENTS, MOCK_SCOPE_DATA } from '@/mock';
import type { ScopeItem } from '@/types';
import * as tableService from '@/services';
import {
  HistoryPanel,
  type HistoryItem,
} from '@/components/molecules/HistoryPanel';
import {
  EditableTable,
  type EditableColumnConfig,
} from '@/components/molecules/EditableTable';
import { useAnalysis } from '@/contexts';
import './index.scss';

const SCOPE_ID_PREFIX = 'SCO.';
const SCOPE_ID_LENGTH = 5;

const systemDropdownOptions = SYSTEMS.map((s) => s.value);
const componentDropdownOptions = COMPONENTS.map((c) => c.value);

const createEmptyScopeItem = (existingData: ScopeItem[]): ScopeItem => {
  return {
    scope_id: tableService.generateNextId(
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

export const ScopeNew: React.FC = () => {
  const { markTabAsChanged, markTabAsSaved } = useAnalysis();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [scopeData, setScopeData] = useState<ScopeItem[]>(MOCK_SCOPE_DATA);
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());

  // Track pending changes to commit to history on save
  const pendingChangesRef = React.useRef<{
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

  const columns: EditableColumnConfig<ScopeItem>[] = useMemo(
    () => [
      {
        key: 'scope_id',
        title: 'Scope ID',
        dataIndex: 'scope_id',
        width: 120,
        editable: false,
        readOnly: true,
      },
      {
        key: 'system',
        title: 'System',
        dataIndex: 'system',
        width: 150,
        editable: true,
        type: 'dropdown',
        options: systemDropdownOptions,
        onCellChange: (record, value) => {
          // Only reset dependent fields if system actually changed
          if (record.system === value) {
            return { system: value };
          }
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
        options: componentDropdownOptions,
        onCellChange: (record, value) => {
          // Only reset dependent fields if component actually changed
          if (record.component === value) {
            return { component: value };
          }
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
          if (record.component) {
            return tableService.getElementOptionsByComponent(record.component);
          }
          return [];
        },
        readOnly: (record) => !record.component,
        onCellChange: (record, value) => {
          // Only reset description if element actually changed
          if (record.element === value) {
            return { element: value };
          }
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
      },
    ],
    []
  );

  const handleDataChange = useCallback(
    (newData: ScopeItem[]) => {
      // Detect all changes (including cascading resets) for highlighting
      if (scopeData.length === newData.length) {
        const newChangedCells = new Set(changedCells);
        let hasChanges = false;

        newData.forEach((newItem, index) => {
          const oldItem = scopeData[index];
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

      setScopeData(newData);
      markTabAsChanged('Scope');
    },
    [scopeData, changedCells, markTabAsChanged]
  );

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: ScopeItem
    ) => {
      // Track edited cell for history
      const itemId = record.scope_id;
      const columnTitle =
        columns.find((col) => col.key === columnKey)?.title || columnKey;

      pendingChangesRef.current.edited.push({
        itemId,
        row: rowIndex,
        column: columnTitle,
        oldValue,
        newValue,
      });
    },
    [columns]
  );

  const handleRowAdd = useCallback((newRow: ScopeItem) => {
    pendingChangesRef.current.added.push(newRow.scope_id);
  }, []);

  const handleRowDelete = useCallback((deletedRows: ScopeItem[]) => {
    const deletedIds = deletedRows.map((row) => row.scope_id);
    pendingChangesRef.current.deleted.push(...deletedIds);
  }, []);

  const handleSave = useCallback(
    (data: ScopeItem[]) => {
      if (data.length === 0) {
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

      // Move changed cells to saved cells for highlighting (cumulative)
      setSavedCells((prev) => {
        const newSaved = new Set(prev);
        changedCells.forEach((cell) => newSaved.add(cell));

        // Identify added rows and mark all their cells as saved/highlighted
        const addedIds = new Set(pending.added);
        if (addedIds.size > 0) {
          data.forEach((row, rowIndex) => {
            if (addedIds.has(row.scope_id)) {
              newSaved.add(`${rowIndex}-system`);
              newSaved.add(`${rowIndex}-component`);
              newSaved.add(`${rowIndex}-element`);
              newSaved.add(`${rowIndex}-description`);
            }
          });
        }

        return newSaved;
      });
      // Clear changed cells
      setChangedCells(new Set());

      // Mark tab as saved
      markTabAsSaved('Scope');

      console.log('Scope data to save:', data);
    },
    [changedCells, markTabAsSaved]
  );

  return (
    <div className="scope-tab">
      <div className="scope-content">
        <EditableTable<ScopeItem>
          columns={columns}
          dataSource={scopeData}
          createEmptyRow={createEmptyScopeItem}
          onDataChange={handleDataChange}
          onCellEdit={handleCellEdit}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          onSave={handleSave}
          title="Scope"
          showHistory={true}
          onHistoryClick={() => setHistoryVisible(true)}
          highlightedCells={savedCells}
        />
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
