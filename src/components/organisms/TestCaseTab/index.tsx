import React, { useCallback, useMemo } from 'react';
import { message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { MOCK_TEST_CASE_TABLE_DATA } from '@/mock';
import type { TestCaseTableRow } from '@/types';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/stores';
import { useTableManagement } from '@/hooks';
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

const TestCaseTab: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    markTabAsSaved,
    markTabAsChanged,
    setSelectedTestCaseId,
    setActiveTab,
  } = useAnalysis();

  // Use table management hook
  const {
    data,
    history,
    historyVisible,
    savedCells,
    setData,
    setHistoryVisible,
    setChangedCells,
    handleRowAdd,
    handleRowDelete,
    handleCellEdit: baseCellEdit,
    handleSave: baseSave,
    trackDataChanges,
  } = useTableManagement<TestCaseTableRow>({
    initialData: MOCK_TEST_CASE_TABLE_DATA,
    tabKey: TAB_KEYS.TEST_CASES,
    idField: 'testcase_id',
    markTabAsChanged,
    markTabAsSaved,
  });

  const handleTestCaseIdClick = useCallback(
    (testCaseId: string) => {
      // Update URL with tc_id param
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('tc_id', testCaseId);
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });

      // Update context
      setSelectedTestCaseId(testCaseId);
      setActiveTab(TAB_KEYS.TEST_CASE_DETAILS);
    },
    [navigate, location, setSelectedTestCaseId, setActiveTab]
  );

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
        onCellClick: (record) => handleTestCaseIdClick(record.testcase_id),
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
    [handleTestCaseIdClick]
  );

  const handleDataChange = useCallback(
    (newData: TestCaseTableRow[]) => {
      const reindexedData = newData.map((item, index) => ({
        ...item,
        testcase_id: item.testcase_id || generateTestCaseId(index),
      }));

      if (data.length === reindexedData.length) {
        const fields: (keyof TestCaseTableRow)[] = [
          'group',
          'suite',
          'code',
          'status',
          'pre_condition',
          'tc_description',
          'ticket_code',
          'priority',
          'complexity',
          'test_type',
          'core_custom',
          'note',
          'reason',
          'version',
          'history',
        ];
        const newChangedCells = trackDataChanges(reindexedData, data, fields);
        if (newChangedCells.size > 0) {
          setChangedCells((prev) => new Set([...prev, ...newChangedCells]));
        }
      }

      setData(reindexedData);
    },
    [data, trackDataChanges, setData, setChangedCells]
  );

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: TestCaseTableRow
    ) => {
      const columnTitle =
        columns.find((col) => col.key === columnKey)?.title || columnKey;
      baseCellEdit(
        rowIndex,
        columnKey,
        oldValue,
        newValue,
        record,
        columnTitle as string
      );
    },
    [columns, baseCellEdit]
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

      baseSave(dataToSave, (item) => Boolean(item.code || item.tc_description));
    },
    [baseSave]
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

export default TestCaseTab;
