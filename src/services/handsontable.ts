import type Handsontable from 'handsontable';
import { ELEMENTS_BY_COMPONENT } from '@/mock';

export const getElementOptionsByComponent = (
  componentValue: string
): string[] => {
  const elements = ELEMENTS_BY_COMPONENT[componentValue] || [];
  return elements.map((el) => el.value);
};

export const getAllElementDropdownOptions = (): string[] => {
  const allElements = new Set<string>();
  Object.values(ELEMENTS_BY_COMPONENT).forEach((elements) => {
    elements.forEach((el) => allElements.add(el.value));
  });
  return Array.from(allElements).sort();
};

export const generateNextId = <T extends object>(
  existingData: T[],
  idField: keyof T,
  prefix: string,
  length: number
): string => {
  const maxIdNumber = existingData.reduce((max, item) => {
    const fieldValue = item[idField];
    if (
      fieldValue &&
      typeof fieldValue === 'string' &&
      fieldValue.startsWith(prefix)
    ) {
      const idNumber = parseInt(fieldValue.replace(prefix, ''), 10);
      return Math.max(max, idNumber);
    }
    return max;
  }, 0);

  const nextIdNumber = maxIdNumber + 1;
  return `${prefix}${String(nextIdNumber).padStart(length, '0')}`;
};

export const loadDataFromStorage = <T extends object>(
  storageKey: string,
  mockData: T[],
  idField: keyof T,
  prefix: string,
  length: number
): T[] => {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);

      let needsMigration = false;
      const migratedData = parsedData.map((item: T, index: number) => {
        if (!item[idField]) {
          needsMigration = true;
          return {
            ...item,
            [idField]: `${prefix}${String(index + 1).padStart(length, '0')}`,
          };
        }
        return item;
      });

      if (needsMigration) {
        localStorage.setItem(storageKey, JSON.stringify(migratedData));
      }

      return migratedData;
    }
  } catch (error) {
    console.error(
      `Error loading data from localStorage (${storageKey}):`,
      error
    );
  }
  return mockData;
};

export const saveDataToStorage = <T>(storageKey: string, data: T[]): void => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage (${storageKey}):`, error);
  }
};

export const updateDynamicDropdownOptions = (
  hotInstance: Handsontable.Core,
  data: Array<{ component?: string }>,
  elementColumnIndex: number,
  getElementOptions: (component: string) => string[]
): void => {
  data.forEach((row, rowIndex) => {
    if (row.component) {
      const elementOptions = getElementOptions(row.component);
      hotInstance.setCellMeta(
        rowIndex,
        elementColumnIndex,
        'source',
        elementOptions
      );
      hotInstance.setCellMeta(rowIndex, elementColumnIndex, 'readOnly', false);
    } else {
      hotInstance.setCellMeta(rowIndex, elementColumnIndex, 'source', []);
      hotInstance.setCellMeta(rowIndex, elementColumnIndex, 'readOnly', true);
    }
  });

  hotInstance.render();
};

export const getSelectedPhysicalRows = (
  hotInstance: Handsontable.Core
): Set<number> => {
  const selectedRanges = hotInstance.getSelected();
  const physicalRowIndices = new Set<number>();

  if (!selectedRanges || selectedRanges.length === 0) {
    return physicalRowIndices;
  }

  selectedRanges.forEach((range: number[]) => {
    const [startRow, , endRow] = range;
    for (let visualRow = startRow; visualRow <= endRow; visualRow++) {
      const physicalRow = hotInstance.toPhysicalRow(visualRow);
      if (physicalRow !== null && physicalRow !== undefined) {
        physicalRowIndices.add(physicalRow);
      }
    }
  });

  return physicalRowIndices;
};

export const createColumnConfig = (
  columnIndex: number,
  columnSettings: {
    data: string;
    type: 'text' | 'dropdown';
    width: number;
    readOnly?: boolean;
    source?: string[];
    strict?: boolean;
    allowInvalid?: boolean;
  }
): Handsontable.ColumnSettings => {
  const config: Handsontable.ColumnSettings = {
    data: columnSettings.data,
    type: columnSettings.type,
    width: columnSettings.width,
  };

  if (columnSettings.readOnly !== undefined) {
    config.readOnly = columnSettings.readOnly;
  }

  if (columnSettings.type === 'dropdown') {
    config.source = columnSettings.source || [];
    config.strict = columnSettings.strict ?? true;
    config.allowInvalid = columnSettings.allowInvalid ?? false;
  }

  return config;
};

export const createTabKeyHandler = <T extends object>(
  hotInstance: Handsontable.Core | null | undefined,
  data: T[],
  totalColumns: number,
  createNewRow: (existingData: T[]) => T,
  onDataUpdate: (updatedData: T[]) => void
) => {
  return (event: KeyboardEvent): void => {
    if (!hotInstance) return;

    if (event.key === 'Tab' && !event.shiftKey) {
      const selected = hotInstance.getSelected();
      if (!selected || selected.length === 0) return;

      const [row, col] = selected[0];
      const lastRowIndex = data.length - 1;
      const lastColumnIndex = totalColumns - 1;

      if (row === lastRowIndex && col === lastColumnIndex) {
        event.preventDefault();

        const newRow = createNewRow(data);
        const updatedData = [...data, newRow];
        onDataUpdate(updatedData);

        setTimeout(() => {
          hotInstance.selectCell(updatedData.length - 1, 0);
          hotInstance.scrollViewportTo(updatedData.length - 1);
        }, 100);
      }
    }
  };
};
