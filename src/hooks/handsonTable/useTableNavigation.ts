import { useCallback } from 'react';
import type { HandsonColumnConfig } from '@/types/handsonTable';

export function useTableNavigation<T>(
  columns: HandsonColumnConfig<T>[],
  latestDataRef: React.MutableRefObject<T[]>,
  handleAddRow: () => void
) {
  const getCellElement = (rowIndex: number, key: string) =>
    document.querySelector(
      `[data-row-index="${rowIndex}"][data-column-key="${key}"]`
    ) as HTMLElement;

  const focusCell = useCallback(
    (rowIndex: number, key: string, openEditor = false) => {
      setTimeout(() => {
        const cell = getCellElement(rowIndex, key);
        if (cell) {
          cell.focus();
          if (openEditor) cell.click();
        }
      }, 150);
    },
    []
  );

  const getNextEditablePosition = useCallback(
    (
      startRow: number,
      startColIndex: number,
      direction: 'forward' | 'backward'
    ) => {
      let colIndex = startColIndex;
      let rowIndex = startRow;
      const dataNow = latestDataRef.current;

      while (true) {
        if (direction === 'forward') {
          colIndex++;
          if (colIndex >= columns.length) {
            colIndex = 0;
            rowIndex++;
          }
        } else {
          colIndex--;
          if (colIndex < 0) {
            colIndex = columns.length - 1;
            rowIndex--;
          }
        }

        if (rowIndex < 0 || rowIndex >= dataNow.length) return null;

        const col = columns[colIndex];
        const record = dataNow[rowIndex];
        const isReadOnly =
          typeof col.readOnly === 'function'
            ? col.readOnly(record)
            : col.readOnly;

        if (col.editable && !isReadOnly) {
          return { rowIndex, colIndex, key: col.key };
        }
      }
    },
    [columns, latestDataRef]
  );

  const navigateCell = useCallback(
    (
      rowIndex: number,
      columnKey: string,
      direction: 'next' | 'prev' | 'down'
    ) => {
      const currentColIndex = columns.findIndex((c) => c.key === columnKey);
      if (currentColIndex === -1) return;

      if (direction === 'down') {
        const nextRow = rowIndex + 1;
        if (nextRow < latestDataRef.current.length) {
          const nextRecord = latestDataRef.current[nextRow];
          const targetCol = columns.find(
            (c) =>
              c.editable &&
              !(typeof c.readOnly === 'function'
                ? c.readOnly(nextRecord)
                : c.readOnly)
          );
          if (targetCol) focusCell(nextRow, targetCol.key);
        }
        return;
      }

      if (direction === 'next') {
        const lastEditableCol = [...columns].reverse().find((c) => c.editable);
        const isLastCol = columns[currentColIndex].key === lastEditableCol?.key;
        const isLastRow = rowIndex === latestDataRef.current.length - 1;

        if (isLastCol && isLastRow) {
          handleAddRow();
          return;
        }
      }

      const nextPos = getNextEditablePosition(
        rowIndex,
        currentColIndex,
        direction === 'next' ? 'forward' : 'backward'
      );
      if (nextPos) {
        focusCell(nextPos.rowIndex, nextPos.key, direction === 'next');
      }
    },
    [columns, getNextEditablePosition, handleAddRow, focusCell, latestDataRef]
  );

  return {
    focusCell,
    navigateCell,
    getNextEditablePosition,
  };
}
