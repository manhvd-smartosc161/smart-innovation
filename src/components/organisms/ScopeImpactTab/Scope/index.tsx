import React, { useCallback, useMemo } from 'react';
import { message } from 'antd';
import { SYSTEMS, COMPONENTS, MOCK_SCOPE_DATA } from '@/mock';
import type { ScopeItem } from '@/types';
import * as tableService from '@/services';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { useAnalysis } from '@/contexts';
import { useTableManagement } from '@/hooks';
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
    scope_description: '',
  };
};

export const Scope: React.FC = () => {
  const { markTabAsChanged, markTabAsSaved } = useAnalysis();

  const {
    data: scopeData,
    history,
    historyVisible,
    savedCells,
    setData: setScopeData,
    setHistoryVisible,
    setChangedCells,
    handleRowAdd,
    handleRowDelete,
    handleCellEdit: baseCellEdit,
    handleSave: baseSave,
    trackDataChanges,
  } = useTableManagement<ScopeItem>({
    initialData: MOCK_SCOPE_DATA,
    tabKey: 'Scope',
    idField: 'scope_id',
    markTabAsChanged,
    markTabAsSaved,
  });

  const columns: HandsonColumnConfig<ScopeItem>[] = useMemo(
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
        key: 'scope_description',
        title: 'Description',
        dataIndex: 'scope_description',
        width: 300,
        editable: true,
        type: 'text',
      },
    ],
    []
  );

  const handleDataChange = useCallback(
    (newData: ScopeItem[]) => {
      if (scopeData.length === newData.length) {
        const newChangedCells = trackDataChanges(newData, scopeData, [
          'system',
          'component',
          'element',
          'scope_description',
        ]);
        if (newChangedCells.size > 0) {
          setChangedCells((prev) => new Set([...prev, ...newChangedCells]));
        }
      }
      setScopeData(newData);
      markTabAsChanged('Scope');
    },
    [
      scopeData,
      trackDataChanges,
      setScopeData,
      setChangedCells,
      markTabAsChanged,
    ]
  );

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: ScopeItem
    ) => {
      const columnTitle =
        columns.find((col) => col.key === columnKey)?.title || columnKey;
      baseCellEdit(
        rowIndex,
        columnKey,
        oldValue,
        newValue,
        record,
        columnTitle
      );
    },
    [columns, baseCellEdit]
  );

  const handleSave = useCallback(
    (data: ScopeItem[]) => {
      if (data.length === 0) {
        message.warning('Please add at least one row before saving.');
        return;
      }
      baseSave(data);
    },
    [baseSave]
  );

  return (
    <div className="scope-tab">
      <div className="scope-content">
        <HandsonTable<ScopeItem>
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
