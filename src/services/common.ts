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
