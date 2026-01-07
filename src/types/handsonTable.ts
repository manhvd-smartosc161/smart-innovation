// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HandsonColumnConfig<T = Record<string, any>> {
  key: string;
  title: string;
  dataIndex: string;
  width?: number;
  editable?: boolean;
  type?: 'text' | 'dropdown' | 'textarea';
  options?: string[] | ((record: T) => string[]);
  readOnly?: boolean | ((record: T) => boolean);
  sortable?: boolean; // Enable/disable sorting for this column
  filterable?: boolean; // Enable/disable filtering for this column
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T, index: number) => React.ReactNode;
  onCellChange?: (record: T, value: string) => Partial<T>;
  onCellClick?: (record: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HandsonTableProps<T extends Record<string, any>> {
  columns: HandsonColumnConfig<T>[];
  dataSource: T[];
  onDataChange?: (data: T[]) => void;
  onSave?: (data: T[]) => void;
  onCellEdit?: (
    rowIndex: number,
    columnKey: string,
    oldValue: string,
    newValue: string,
    record: T
  ) => void;
  onRowAdd?: (newRow: T) => void;
  onRowDelete?: (deletedRows: T[]) => void;
  createEmptyRow: (existingData: T[]) => T;
  title?: React.ReactNode;
  showHistory?: boolean;
  onHistoryClick?: () => void;
  highlightedCells?: Set<string>;
  disabled?: boolean;
  hideSaveButton?: boolean;
  headerActions?: React.ReactNode;
  isActionHidden?: boolean;
}

export interface HandsonCellState {
  rowIndex: number;
  columnKey: string;
}

export interface SortedInfo {
  columnKey?: React.Key;
  order?: 'ascend' | 'descend';
}
