import React, { useState, useCallback, useMemo, useRef } from 'react';
import { message } from 'antd';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { MOCK_TEST_CASE_TABLE_DATA } from '@/mock';
import type { TestCaseTableRow } from '@/types';
import {
  HistoryPanel,
  type HistoryItem,
} from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/contexts';
import { TAB_KEYS } from '@/constants';
import './index.scss';

const generateTestCaseId = (rowIndex: number): string => {
  const idNumber = (rowIndex + 1).toString().padStart(5, '0');
  return `TC.${idNumber}`;
};

const createEmptyTestCaseItem = (
  existingData: TestCaseTableRow[]
): TestCaseTableRow => {
  return {
    testcase_id: generateTestCaseId(existingData.length),
    group: '',
    suite: '',
    code: '',
    status: '',
    pre_condition: '',
    tc_description: '',
    ticket_code: '',
    priority: '',
    complexity: '',
    test_type: '',
    core_custom: '',
    note: '',
    reason: '',
    version: '',
    history: '',
  };
};

export const TestCaseTable: React.FC = () => {
  // Use TEST_CASES tab key if available, otherwise fallback or add to constants if strict types
  const { markTabAsSaved } = useAnalysis();
  const [data, setData] = useState<TestCaseTableRow[]>(
    MOCK_TEST_CASE_TABLE_DATA
  );
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

  const columns: HandsonColumnConfig<TestCaseTableRow>[] = useMemo(
    () => [
      {
        key: 'testcase_id',
        title: 'Test Case ID',
        dataIndex: 'testcase_id',
        width: 120,
        editable: false,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'group',
        title: 'Group',
        dataIndex: 'group',
        width: 100,
        editable: true,
        type: 'text',
        sortable: false,
      },
      {
        key: 'suite',
        title: 'Suite',
        dataIndex: 'suite',
        width: 100,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'code',
        title: 'Code',
        dataIndex: 'code',
        width: 120,
        editable: true,
        type: 'text',
        sortable: false,
      },
      {
        key: 'status',
        title: 'Status',
        dataIndex: 'status',
        width: 100,
        editable: true,
        type: 'dropdown',
        options: ['Passed', 'Failed', 'Pending', 'Blocked'],
        sortable: false,
      },
      {
        key: 'pre_condition',
        title: 'Pre Condition',
        dataIndex: 'pre_condition',
        width: 150,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'tc_description',
        title: 'Description',
        dataIndex: 'tc_description',
        width: 250,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'ticket_code',
        title: 'Ticket Code',
        dataIndex: 'ticket_code',
        width: 150,
        editable: true,
        type: 'text',
        sortable: false,
      },
      {
        key: 'priority',
        title: 'Priority',
        dataIndex: 'priority',
        width: 100,
        editable: true,
        type: 'dropdown',
        options: ['High', 'Medium', 'Low'],
        sortable: false,
      },
      {
        key: 'complexity',
        title: 'Complexity',
        dataIndex: 'complexity',
        width: 100,
        editable: true,
        type: 'dropdown',
        options: ['High', 'Medium', 'Low'],
        sortable: false,
      },
      {
        key: 'test_type',
        title: 'Test Type',
        dataIndex: 'test_type',
        width: 120,
        editable: true,
        type: 'dropdown',
        options: ['Functional', 'UI', 'Integration', 'Performance'],
        sortable: false,
      },
      {
        key: 'core_custom',
        title: 'Core/Custom',
        dataIndex: 'core_custom',
        width: 120,
        editable: true,
        type: 'dropdown',
        options: ['Core', 'Custom'],
        sortable: false,
      },
      {
        key: 'note',
        title: 'Note',
        dataIndex: 'note',
        width: 150,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'reason',
        title: 'Reason',
        dataIndex: 'reason',
        width: 150,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'version',
        title: 'Version',
        dataIndex: 'version',
        width: 100,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
      {
        key: 'history',
        title: 'History',
        dataIndex: 'history',
        width: 150,
        editable: true,
        type: 'text',
        sortable: false,
        filterable: false,
      },
    ],
    []
  );

  const handleDataChange = useCallback(
    (newData: TestCaseTableRow[]) => {
      // Re-index IDs if necessary for internal tracking, but 'id' usually stays stable for edit
      const reindexedData = newData.map((item, index) => ({
        ...item,
        testcase_id: item.testcase_id || generateTestCaseId(index),
      }));

      if (data.length === reindexedData.length) {
        const newChangedCells = new Set(changedCells);
        let hasChanges = false;

        reindexedData.forEach((newItem, index) => {
          const oldItem = data[index];
          // Check all keys
          Object.keys(newItem).forEach((key) => {
            const k = key as keyof TestCaseTableRow;
            if (newItem[k] !== oldItem[k]) {
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

  const handleRowAdd = useCallback((newRow: TestCaseTableRow) => {
    pendingChangesRef.current.added.push(newRow.testcase_id);
  }, []);

  const handleRowDelete = useCallback((deletedRows: TestCaseTableRow[]) => {
    const deletedIds = deletedRows.map((r) => r.testcase_id);
    pendingChangesRef.current.deleted.push(...deletedIds);
  }, []);

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: TestCaseTableRow
    ) => {
      const itemId = record.testcase_id;
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
    (dataToSave: TestCaseTableRow[]) => {
      const validData = dataToSave.filter(
        (item) => item.code || item.tc_description
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
            if (addedIds.has(row.testcase_id)) {
              // Mark all cells in added rows
              Object.keys(row).forEach((key) => {
                newSaved.add(`${rowIndex}-${key}`);
              });
            }
          });
        }

        return newSaved;
      });
      setChangedCells(new Set());

      // Use a generic key or one from TAB_KEYS if appropriate, else hardcode 'TEST_CASES'
      markTabAsSaved(TAB_KEYS.TEST_CASES || 'TEST_CASES');

      console.log('Test Case data to save:', validData);
    },
    [changedCells, markTabAsSaved]
  );

  return (
    <div className="test-case-table-tab">
      <div className="test-case-table-content">
        <HandsonTable
          title="Test Cases"
          columns={columns}
          dataSource={data}
          onDataChange={handleDataChange}
          onSave={handleSave}
          onCellEdit={handleCellEdit}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          createEmptyRow={createEmptyTestCaseItem}
          showHistory={true}
          onHistoryClick={() => setHistoryVisible(true)}
          highlightedCells={savedCells}
        />
      </div>
      <HistoryPanel
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title="Test Case Change History"
      />
    </div>
  );
};
