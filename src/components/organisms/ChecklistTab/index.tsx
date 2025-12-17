import React, { useState, useCallback, useMemo, useRef } from 'react';
import { message, Button, Divider } from 'antd';
import { FileTextOutlined, ExperimentOutlined } from '@ant-design/icons';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { MOCK_CHECKLIST_DATA, MOCK_SCOPE_DATA, MOCK_IMPACT_DATA } from '@/mock';
import type { ChecklistItem } from '@/types';
import {
  HistoryPanel,
  type HistoryItem,
} from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/contexts';
import { TAB_KEYS } from '@/constants';
import './index.scss';

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

export const ChecklistTab: React.FC = () => {
  const { markTabAsSaved } = useAnalysis();
  const [data, setData] = useState<ChecklistItem[]>(MOCK_CHECKLIST_DATA);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  // Track changed cells since last save (for highlighting)
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());

  // Animation states
  const [showTestCase, setShowTestCase] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

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

  const handleGenerateTestCases = () => {
    setShowTestCase(true);

    setTimeout(() => {
      setShowTestCase(false);
      setShowFireworks(true);
    }, 1500);

    setTimeout(() => {
      setShowFireworks(false);
    }, 3500);

    console.log('Generating test cases from checklist data:', data);
  };

  const columns: HandsonColumnConfig<ChecklistItem>[] = useMemo(
    () => [
      {
        key: 'checklist_id',
        title: 'Checklist ID',
        dataIndex: 'checklist_id',
        width: 120,
        readOnly: true,
      },
      {
        key: 'type',
        title: 'Type',
        dataIndex: 'type',
        width: 120,
        editable: true,
        type: 'dropdown',
        options: ['Scope', 'Impact'],
        onCellChange: (record, value) => {
          if (record.type === value) {
            return { type: value as 'Scope' | 'Impact' | '' };
          }
          // Reset dependent fields
          return {
            type: value as 'Scope' | 'Impact' | '',
            item: '',
            description: '',
          };
        },
      },
      {
        key: 'item',
        title: 'Item',
        dataIndex: 'item',
        width: 150,
        editable: true,
        type: 'dropdown',
        options: (record) => {
          if (record.type === 'Scope') {
            return MOCK_SCOPE_DATA.map((item) => item.scope_id);
          }
          if (record.type === 'Impact') {
            return MOCK_IMPACT_DATA.map((item) => item.impact_id);
          }
          return [];
        },
        onCellChange: (record, value) => {
          if (record.item === value) {
            return { item: value };
          }
          // Reset dependent fields
          return {
            item: value,
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
    (newData: ChecklistItem[]) => {
      // Re-index IDs
      const reindexedData = newData.map((item, index) => ({
        ...item,
        checklist_id: generateChecklistId(index),
      }));

      // Detect all changes (including cascading resets) for highlighting
      // We compare reindexedData with the current 'data' state
      if (data.length === reindexedData.length) {
        const newChangedCells = new Set(changedCells);
        let hasChanges = false;

        reindexedData.forEach((newItem, index) => {
          const oldItem = data[index];
          (['type', 'item', 'description'] as const).forEach((key) => {
            if (newItem[key] !== oldItem[key]) {
              newChangedCells.add(`${index}-${key}`);
              hasChanges = true;
            }
          });
        });

        if (hasChanges) {
          setChangedCells(newChangedCells);
        }
      }

      setData(reindexedData);
    },
    [data, changedCells]
  );

  const handleRowAdd = useCallback((newRow: ChecklistItem) => {
    pendingChangesRef.current.added.push(newRow.checklist_id);
  }, []);

  const handleRowDelete = useCallback((deletedRows: ChecklistItem[]) => {
    const deletedIds = deletedRows.map((r) => r.checklist_id);
    pendingChangesRef.current.deleted.push(...deletedIds);
  }, []);

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: ChecklistItem
    ) => {
      const itemId = record.checklist_id;
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
    (dataToSave: ChecklistItem[]) => {
      const validData = dataToSave.filter(
        (item) => item.type || item.item || item.description
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
        changedCells.forEach((c) => newSaved.add(c));

        // Identify added rows and mark all their cells as saved/highlighted
        const addedIds = new Set(pending.added);
        if (addedIds.size > 0) {
          dataToSave.forEach((row, rowIndex) => {
            if (addedIds.has(row.checklist_id)) {
              newSaved.add(`${rowIndex}-type`);
              newSaved.add(`${rowIndex}-item`);
              newSaved.add(`${rowIndex}-description`);
            }
          });
        }
        return newSaved;
      });
      setChangedCells(new Set());

      markTabAsSaved(TAB_KEYS.CHECKLIST);

      console.log('Checklist data to save:', validData);
    },
    [changedCells, markTabAsSaved]
  );

  const isGenerateDisabled =
    data.filter((item) => item.type || item.item || item.description).length ===
    0;

  return (
    <div className="checklist-tab">
      {/* Test Case Flying Animation */}
      {showTestCase && (
        <div className="flying-testcase-container">
          <div className="flying-testcase">📝</div>
        </div>
      )}

      {/* Fireworks Animation */}
      {showFireworks && (
        <div className="fireworks-container">
          <div className="firework firework-1"></div>
          <div className="firework firework-2"></div>
          <div className="firework firework-3"></div>
          <div className="firework firework-4"></div>
          <div className="firework firework-5"></div>
          <div className="firework firework-6"></div>
          <div className="firework firework-7"></div>
          <div className="firework firework-8"></div>
          <div className="firework firework-9"></div>
          <div className="firework firework-10"></div>
          <div className="firework firework-11"></div>
          <div className="firework firework-12"></div>
        </div>
      )}

      {/* Generate Test Cases Button - Sticky */}
      <div className="generate-testcases-section">
        <div className="generate-icon-left">
          <FileTextOutlined />
        </div>
        <Button
          type="primary"
          size="large"
          onClick={handleGenerateTestCases}
          disabled={isGenerateDisabled}
          className="generate-testcases-button"
        >
          Generate Test Cases
        </Button>
        <div className="generate-icon-right">
          <ExperimentOutlined />
        </div>
      </div>

      <Divider />

      <div className="checklist-content">
        <HandsonTable
          title="Checklist"
          columns={columns}
          dataSource={data}
          onDataChange={handleDataChange}
          onSave={handleSave}
          onCellEdit={handleCellEdit}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          createEmptyRow={createEmptyChecklistItem}
          showHistory={true}
          onHistoryClick={() => setHistoryVisible(true)}
          highlightedCells={savedCells}
        />
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
