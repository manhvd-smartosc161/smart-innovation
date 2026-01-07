import React, { useState, useCallback, useMemo } from 'react';
import { message, Divider } from 'antd';
import {
  FileTextOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Button, AnimatedText } from '@/components/atoms';
import { FireworksAnimation, SaveSection } from '@/components/molecules';
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

interface ChecklistTabProps {
  isActionHidden?: boolean;
}

const ChecklistTab: React.FC<ChecklistTabProps> = ({ isActionHidden }) => {
  const {
    markTabAsSaved,
    markTabAsChanged,
    setIsTestCasesGenerated,
    setActiveTab,
    setSelectedTestCaseId,
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

  // Read-only mode state
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Saved state for cancel functionality
  const [savedState, setSavedState] = useState({
    data: [] as ChecklistItem[],
  });

  const handleEdit = () => {
    // Save current state before editing
    setSavedState({
      data: JSON.parse(JSON.stringify(data)),
    });
    setIsReadOnly(false);
  };

  const handleSaveChanges = async () => {
    // Check if there are any changes
    const hasChanges = JSON.stringify(data) !== JSON.stringify(savedState.data);

    if (!hasChanges) {
      // No changes, just return to read-only mode
      setIsReadOnly(true);
      message.info('No changes to save');
      return;
    }

    setIsSaving(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Calculate history and persist changes
    handleSave(data);

    // Save the current state
    setSavedState({
      data: JSON.parse(JSON.stringify(data)),
    });

    setIsReadOnly(true);
    setIsSaving(false);
    message.success('Changes saved successfully!');
  };

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
      setSelectedTestCaseId(null);
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

  // Validation for Save button
  const isSaveDisabled = isSaving;

  return (
    <div className="checklist-tab">
      {/* Fireworks Animation */}
      <FireworksAnimation show={showFireworks} />

      {/* Generate Test Cases Button - Sticky */}
      {!isActionHidden && (
        <>
          <div className="generate-testcases-section">
            <div className="generate-icon-left">
              <FileTextOutlined />
            </div>
            <Button
              variant="primary"
              size="large"
              onClick={handleGenerateTestCases}
              disabled={isGenerateDisabled || isGenerating || !isReadOnly}
              className="generate-testcases-button"
            >
              {isGenerating ? (
                <AnimatedText
                  text="Generating..."
                  className="generating-text"
                />
              ) : (
                'Generate Test Cases'
              )}
            </Button>
            <div className="generate-icon-right">
              <ExperimentOutlined />
            </div>

            {/* Edit/Save Button */}
            <SaveSection
              isReadOnly={isReadOnly}
              isSaving={isSaving}
              isSaveDisabled={isSaveDisabled}
              onEdit={handleEdit}
              onSave={handleSaveChanges}
              className="checklist-save-section"
            />
          </div>

          <Divider
            style={{
              margin:
                'var(--spacing-md) calc(-1 * var(--spacing-xl)) var(--spacing-md)',
              borderColor: 'rgba(0, 0, 0, 0.06)',
            }}
          />
        </>
      )}

      <div className="checklist-content">
        <HandsonTable
          title={
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircleOutlined /> Checklist
            </span>
          }
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
          disabled={isReadOnly || isSaving}
          hideSaveButton={true}
          isActionHidden={isActionHidden}
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
