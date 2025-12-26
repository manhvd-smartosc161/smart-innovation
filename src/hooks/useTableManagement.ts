import { useState, useCallback, useRef } from 'react';
import type { HistoryItem } from '@/components/molecules/HistoryPanel';

interface PendingChanges {
  added: string[];
  edited: Array<{
    itemId: string;
    row: number;
    column: string;
    oldValue: string;
    newValue: string;
  }>;
  deleted: string[];
}

interface UseTableManagementOptions<T> {
  initialData: T[];
  tabKey: string;
  idField: keyof T;
  markTabAsChanged: (tabKey: string) => void;
  markTabAsSaved: (tabKey: string) => void;
}

interface UseTableManagementReturn<T> {
  data: T[];
  history: HistoryItem[];
  historyVisible: boolean;
  changedCells: Set<string>;
  savedCells: Set<string>;
  pendingChangesRef: React.MutableRefObject<PendingChanges>;
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setHistoryVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setChangedCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSavedCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  handleRowAdd: (newRow: T) => void;
  handleRowDelete: (deletedRows: T[]) => void;
  handleCellEdit: (
    rowIndex: number,
    columnKey: string,
    oldValue: string,
    newValue: string,
    record: T,
    columnTitle?: string
  ) => void;
  handleSave: (dataToSave: T[], validationFn?: (item: T) => boolean) => void;
  trackDataChanges: (
    newData: T[],
    oldData: T[],
    fields: (keyof T)[]
  ) => Set<string>;
}

export function useTableManagement<T extends object>({
  initialData,
  tabKey,
  idField,
  markTabAsChanged,
  markTabAsSaved,
}: UseTableManagementOptions<T>): UseTableManagementReturn<T> {
  const [data, setData] = useState<T[]>(initialData);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set());
  const [savedCells, setSavedCells] = useState<Set<string>>(new Set());

  const pendingChangesRef = useRef<PendingChanges>({
    added: [],
    edited: [],
    deleted: [],
  });

  const handleRowAdd = useCallback(
    (newRow: T) => {
      const itemId = String(newRow[idField]);
      pendingChangesRef.current.added.push(itemId);
    },
    [idField]
  );

  const handleRowDelete = useCallback(
    (deletedRows: T[]) => {
      const deletedIds = deletedRows.map((r) => String(r[idField]));
      pendingChangesRef.current.deleted.push(...deletedIds);
    },
    [idField]
  );

  const handleCellEdit = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      oldValue: string,
      newValue: string,
      record: T,
      columnTitle?: string
    ) => {
      const itemId = String(record[idField]);

      pendingChangesRef.current.edited.push({
        itemId,
        row: rowIndex,
        column: columnTitle || columnKey,
        oldValue,
        newValue,
      });

      // Track changed cell
      const cellKey = `${rowIndex}-${columnKey}`;
      setChangedCells((prev) => new Set(prev).add(cellKey));

      // Mark tab as having unsaved changes
      markTabAsChanged(tabKey);
    },
    [idField, tabKey, markTabAsChanged]
  );

  const handleSave = useCallback(
    (dataToSave: T[], validationFn?: (item: T) => boolean) => {
      const validData = validationFn
        ? dataToSave.filter(validationFn)
        : dataToSave;

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

      // Add history for added rows
      pending.added.forEach((itemId) => {
        newHistoryItems.push(createHistoryItem('add', `Added ${itemId}`));
      });

      // Add history for edited cells (deduplicated)
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

      // Add history for deleted rows
      if (pending.deleted.length > 0) {
        const description =
          pending.deleted.length === 1
            ? `Deleted ${pending.deleted[0]}`
            : `Deleted ${pending.deleted.length} rows: ${pending.deleted.join(', ')}`;
        newHistoryItems.push(createHistoryItem('delete', description));
      }

      setHistory((prev) => [...newHistoryItems, ...prev]);

      // Reset pending changes
      pendingChangesRef.current = {
        added: [],
        edited: [],
        deleted: [],
      };

      // Move changed cells to saved cells
      setSavedCells((prev) => {
        const newSaved = new Set(prev);
        changedCells.forEach((c) => newSaved.add(c));

        // Mark all cells in added rows as saved
        const addedIds = new Set(pending.added);
        if (addedIds.size > 0) {
          dataToSave.forEach((row, rowIndex) => {
            const rowId = String(row[idField]);
            if (addedIds.has(rowId)) {
              // Mark all cells in this row
              Object.keys(row).forEach((key) => {
                newSaved.add(`${rowIndex}-${key}`);
              });
            }
          });
        }

        return newSaved;
      });

      setChangedCells(new Set());
      markTabAsSaved(tabKey);

      console.log(`${tabKey} data to save:`, validData);
    },
    [changedCells, tabKey, idField, markTabAsSaved]
  );

  const trackDataChanges = useCallback(
    (newData: T[], oldData: T[], fields: (keyof T)[]): Set<string> => {
      if (oldData.length !== newData.length) {
        return new Set();
      }

      const newChangedCells = new Set<string>();

      newData.forEach((newItem, index) => {
        const oldItem = oldData[index];
        fields.forEach((field) => {
          if (newItem[field] !== oldItem[field]) {
            newChangedCells.add(`${index}-${String(field)}`);
          }
        });
      });

      return newChangedCells;
    },
    []
  );

  return {
    data,
    history,
    historyVisible,
    changedCells,
    savedCells,
    pendingChangesRef,
    setData,
    setHistory,
    setHistoryVisible,
    setChangedCells,
    setSavedCells,
    handleRowAdd,
    handleRowDelete,
    handleCellEdit,
    handleSave,
    trackDataChanges,
  };
}
