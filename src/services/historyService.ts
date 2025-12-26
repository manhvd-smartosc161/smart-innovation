import type { HistoryItem } from '@/components/molecules/HistoryPanel';

const DEFAULT_USER = {
  name: 'Mạnh Vũ Duy (KO)',
  avatar: undefined,
};

export class HistoryService {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  /**
   * Get all history items from localStorage
   */
  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (!data) return [];

      const history = JSON.parse(data);
      // Convert timestamp strings back to Date objects
      return history.map((item: HistoryItem) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  /**
   * Add a new history item
   */
  private addHistoryItem(
    item: Omit<HistoryItem, 'id' | 'user' | 'timestamp'>
  ): void {
    const history = this.getHistory();

    const newItem: HistoryItem = {
      id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user: DEFAULT_USER,
      timestamp: new Date(),
      ...item,
    };

    history.unshift(newItem); // Add to beginning (newest first)

    // Keep only last 100 items to avoid localStorage overflow
    const trimmedHistory = history.slice(0, 100);

    localStorage.setItem(this.storageKey, JSON.stringify(trimmedHistory));
  }

  /**
   * Log an add action
   */
  logAdd(itemId: string, details?: string): void {
    this.addHistoryItem({
      action: 'add',
      description: details || `Added ${itemId}`,
    });
  }

  /**
   * Log an edit action
   */
  logEdit(
    itemId: string,
    row: number,
    column: string,
    oldValue: string,
    newValue: string
  ): void {
    this.addHistoryItem({
      action: 'edit',
      description: `Updated ${column} in ${itemId}`,
      cell: {
        row,
        itemId,
        column,
        oldValue,
        newValue,
      },
    });
  }

  /**
   * Log a delete action
   */
  logDelete(itemId: string, details?: string): void {
    this.addHistoryItem({
      action: 'delete',
      description: details || `Deleted ${itemId}`,
    });
  }

  /**
   * Log multiple row deletions
   */
  logBulkDelete(itemIds: string[]): void {
    if (itemIds.length === 1) {
      this.logDelete(itemIds[0]);
    } else {
      this.addHistoryItem({
        action: 'delete',
        description: `Deleted ${itemIds.length} rows: ${itemIds.join(', ')}`,
      });
    }
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    localStorage.removeItem(this.storageKey);
  }
}

// Create singleton instances for each tab
export const scopeHistoryService = new HistoryService('scope_history');
export const impactHistoryService = new HistoryService('impact_history');
export const checklistHistoryService = new HistoryService('checklist_history');
