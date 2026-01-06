import { useCallback, useMemo, useImperativeHandle } from 'react';
import { message } from 'antd';
import {
  HandsonTable,
  type HandsonColumnConfig,
} from '@/components/molecules/HandsonTable';
import { HistoryPanel } from '@/components/molecules/HistoryPanel';
import { SYSTEMS, COMPONENTS } from '@/mock';
import * as tableService from '@/services';
import { useAnalysis } from '@/stores';
import { useTableManagement } from '@/hooks';
import './index.scss';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface BaseTableProps<T extends Record<string, any>> {
  /**
   * Table title
   */
  title: string;
  /**
   * Tab key for tracking changes
   */
  tabKey: string;
  /**
   * ID prefix (e.g., "SCO.", "IMP.")
   */
  idPrefix: string;
  /**
   * ID length for padding
   */
  idLength: number;
  /**
   * ID field name in data (e.g., "scope_id", "impact_id")
   */
  idField: keyof T;
  /**
   * Description field name in data
   */
  descriptionField: keyof T;
  /**
   * Initial data for the table
   */
  initialData: T[];
  /**
   * Custom ID generator function (optional)
   */
  generateId?: (data: T[]) => string;
  /**
   * Disabled state (read-only mode)
   */
  disabled?: boolean;
  /**
   * Callback when data changes
   */
  onDataChange?: (data: T[]) => void;
  /**
   * Ref to expose save function
   */
  onSaveRef?: React.Ref<{ save: () => void }>;
  /**
   * Whether to hide action buttons (e.g. in Approved status)
   */
  isActionHidden?: boolean;
}

/**
 * BaseTable - Shared base table for Scope and Impact
 * Handles System -> Component -> Element -> Description workflow
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BaseTable<T extends Record<string, any>>({
  title,
  tabKey,
  idPrefix,
  idLength,
  idField,
  descriptionField,
  initialData,
  generateId,
  disabled = false,
  onDataChange,
  onSaveRef,
  isActionHidden,
}: BaseTableProps<T>) {
  const { markTabAsChanged, markTabAsSaved } = useAnalysis();

  // Default ID generator
  const defaultGenerateId = useCallback(
    (data: T[]) => {
      return tableService.generateNextId(
        data,
        idField as string,
        idPrefix,
        idLength
      );
    },
    [idField, idPrefix, idLength]
  );

  const idGenerator = generateId || defaultGenerateId;

  // Create empty row
  const createEmptyRow = useCallback(
    (existingData: T[]): T => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newRow: any = {
        [idField]: idGenerator(existingData),
        system: '',
        component: '',
        element: '',
        [descriptionField]: '',
      };
      return newRow as T;
    },
    [idField, descriptionField, idGenerator]
  );

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
  } = useTableManagement<T>({
    initialData,
    tabKey,
    idField: idField as string,
    markTabAsChanged,
    markTabAsSaved,
  });

  const systemOptions = useMemo(() => SYSTEMS.map((s) => s.value), []);
  const componentOptions = useMemo(() => COMPONENTS.map((c) => c.value), []);

  const columns: HandsonColumnConfig<T>[] = useMemo(
    () =>
      [
        {
          key: idField as string,
          title: `${title} ID`,
          dataIndex: idField as string,
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
          options: systemOptions,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onCellChange: (record: any, value: string) => {
            if (record.system === value) {
              return { system: value };
            }
            return {
              system: value,
              component: '',
              element: '',
              [descriptionField]: '',
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
          options: componentOptions,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          readOnly: (record: any) => !record.system,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onCellChange: (record: any, value: string) => {
            if (record.component === value) {
              return { component: value };
            }
            return {
              component: value,
              element: '',
              [descriptionField]: '',
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          options: (record: any) => {
            return record.component
              ? tableService.getElementOptionsByComponent(record.component)
              : [];
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          readOnly: (record: any) => !record.component,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onCellChange: (record: any, value: string) => {
            if (record.element === value) {
              return { element: value };
            }
            return {
              element: value,
              [descriptionField]: '',
            };
          },
        },
        {
          key: descriptionField as string,
          title: 'Description',
          dataIndex: descriptionField as string,
          width: 300,
          editable: true,
          type: 'text',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          readOnly: (record: any) => !record.element,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    [title, idField, descriptionField, systemOptions, componentOptions]
  );

  const handleDataChange = useCallback(
    (newData: T[]) => {
      // Reindex if needed
      const reindexedData = newData.map((item, index) => ({
        ...item,
        [idField]: item[idField] || idGenerator(newData.slice(0, index)),
      }));

      if (data.length === reindexedData.length) {
        const newChangedCells = trackDataChanges(reindexedData, data, [
          'system',
          'component',
          'element',
          descriptionField as string,
        ]);
        if (newChangedCells.size > 0) {
          setChangedCells((prev) => new Set([...prev, ...newChangedCells]));
        }
      }

      setData(reindexedData);

      // Call parent callback if provided
      if (onDataChange) {
        onDataChange(reindexedData);
      }
    },
    [
      data,
      trackDataChanges,
      setData,
      setChangedCells,
      idField,
      descriptionField,
      idGenerator,
      onDataChange,
    ]
  );

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: T
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
    (dataToSave: T[]) => {
      const validData = dataToSave.filter(
        (item) =>
          item.system ||
          item.component ||
          item.element ||
          item[descriptionField]
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
            item[descriptionField]
        )
      );
    },
    [baseSave, descriptionField]
  );

  // Expose save function to parent via ref
  useImperativeHandle(
    onSaveRef,
    () => ({
      save: () => handleSave(data),
    }),
    [handleSave, data]
  );

  return (
    <div className={`system-component-table ${tabKey.toLowerCase()}-tab`}>
      <div className={`${tabKey.toLowerCase()}-content`}>
        <HandsonTable<T>
          title={title}
          columns={columns}
          dataSource={data}
          onDataChange={handleDataChange}
          onSave={handleSave}
          onCellEdit={handleCellEdit}
          onRowAdd={handleRowAdd}
          onRowDelete={handleRowDelete}
          createEmptyRow={createEmptyRow}
          showHistory={true}
          onHistoryClick={() => setHistoryVisible(true)}
          highlightedCells={savedCells}
          disabled={disabled}
          hideSaveButton={true}
          isActionHidden={isActionHidden}
        />
      </div>
      <HistoryPanel
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        title={`${title} Change History`}
      />
    </div>
  );
}
