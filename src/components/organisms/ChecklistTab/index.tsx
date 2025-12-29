import React, { useState, useCallback, useMemo } from 'react';
import { message, Button, Divider } from 'antd';
import { FileTextOutlined, ExperimentOutlined } from '@ant-design/icons';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { MOCK_CHECKLIST_DATA, MOCK_SCOPE_DATA, MOCK_IMPACT_DATA } from '@/mock';
import type { ChecklistItem } from '@/types';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/stores';
import { useTableManagement } from '@/hooks';
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
    cl_description: '',
  };
};

const ChecklistTab: React.FC = () => {
  const {
    markTabAsSaved,
    markTabAsChanged,
    setIsTestCasesGenerated,
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
  } = useTableManagement<ChecklistItem>({
    initialData: MOCK_CHECKLIST_DATA,
    tabKey: TAB_KEYS.CHECKLIST,
    idField: 'checklist_id',
    markTabAsChanged,
    markTabAsSaved,
  });

  // Animation states
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleGenerateTestCases = async () => {
    setIsGenerating(true);

    // Simulate API call (3 seconds)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // End generating, show fireworks
    setIsGenerating(false);
    setShowFireworks(true);

    setTimeout(() => {
      setShowFireworks(false);
      setIsTestCasesGenerated(true);
      setActiveTab(TAB_KEYS.TEST_CASES);
    }, 2000);

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
        key: 'cl_description',
        title: 'Description',
        dataIndex: 'cl_description',
        width: 300,
        editable: true,
        type: 'text',
      },
    ],
    []
  );

  const handleDataChange = useCallback(
    (newData: ChecklistItem[]) => {
      const reindexedData = newData.map((item, index) => ({
        ...item,
        checklist_id: generateChecklistId(index),
      }));

      if (data.length === reindexedData.length) {
        const newChangedCells = trackDataChanges(reindexedData, data, [
          'type',
          'item',
          'cl_description',
        ]);
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
      record: ChecklistItem
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
    (dataToSave: ChecklistItem[]) => {
      if (
        dataToSave.filter(
          (item) => item.type || item.item || item.cl_description
        ).length === 0
      ) {
        message.warning('Please add at least one row with data before saving.');
        return;
      }
      baseSave(dataToSave, (item) =>
        Boolean(item.type || item.item || item.cl_description)
      );
    },
    [baseSave]
  );

  const isGenerateDisabled =
    data.filter((item) => item.type || item.item || item.cl_description)
      .length === 0;

  return (
    <div className="checklist-tab">
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
          disabled={isGenerateDisabled || isGenerating}
          className="generate-testcases-button"
        >
          {isGenerating ? (
            <span className="generating-text">
              {'Generating...'.split('').map((char, index) => (
                <span key={index}>{char}</span>
              ))}
            </span>
          ) : (
            'Generate Test Cases'
          )}
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

export default ChecklistTab;
