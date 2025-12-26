import React, { useCallback, useMemo } from 'react';
import { message } from 'antd';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { SYSTEMS, COMPONENTS, MOCK_IMPACT_DATA } from '@/mock';
import * as handontableService from '@/services';
import type { ImpactItem } from '@/types';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import { useAnalysis } from '@/contexts';
import { useTableManagement } from '@/hooks';
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
    impact_description: '',
  };
};

export const Impact: React.FC = () => {
  const { markTabAsSaved, markTabAsChanged } = useAnalysis();

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
  } = useTableManagement<ImpactItem>({
    initialData: MOCK_IMPACT_DATA,
    tabKey: 'Impact',
    idField: 'impact_id',
    markTabAsChanged,
    markTabAsSaved,
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
        key: 'impact_description',
        title: 'Description',
        dataIndex: 'impact_description',
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
      const reindexedData = newData.map((item, index) => ({
        ...item,
        impact_id: generateImpactId(index),
      }));

      if (data.length === reindexedData.length) {
        const newChangedCells = trackDataChanges(reindexedData, data, [
          'system',
          'component',
          'element',
          'impact_description',
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
      record: ImpactItem
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
    (dataToSave: ImpactItem[]) => {
      const validData = dataToSave.filter(
        (item) =>
          item.system ||
          item.component ||
          item.element ||
          item.impact_description
      );

      if (validData.length === 0) {
        message.warning('Please add at least one row with data before saving.');
        return;
      }

      baseSave(dataToSave, (item) =>
        Boolean(
          item.system ||
            item.component ||
            item.element ||
            item.impact_description
        )
      );
    },
    [baseSave]
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
