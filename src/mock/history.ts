import type { HistoryItem } from '@/components/molecules/HistoryPanel';

// Generate fake history data
const generateFakeHistory = (
  idPrefix: string,
  idLength: number = 5
): HistoryItem[] => {
  const users = [
    { name: 'John Doe', avatar: undefined },
    { name: 'Jane Smith', avatar: undefined },
    { name: 'Mike Johnson', avatar: undefined },
    { name: 'Sarah Williams', avatar: undefined },
  ];

  const actions: Array<'edit' | 'delete' | 'add'> = ['edit', 'delete', 'add'];

  const history: HistoryItem[] = [];

  // Helper to generate ID
  const generateId = (num: number) => {
    return `${idPrefix}${String(num).padStart(idLength, '0')}`;
  };

  // Generate 15 fake history items
  for (let i = 0; i < 15; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const timestamp = new Date(
      Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
    ); // Random time within last 7 days

    let description = '';
    let cell = undefined;

    if (action === 'edit') {
      const columns = ['System', 'Component', 'Element', 'Description'];
      const column = columns[Math.floor(Math.random() * columns.length)];
      const rowNum = Math.floor(Math.random() * 10) + 1;
      const itemId = generateId(rowNum);
      const oldValues = ['OMS', 'PMS', 'WMS', 'CRM', 'ERP'];
      const newValues = ['Updated OMS', 'New PMS', 'Modified WMS', 'CRM v2'];

      description = `Updated ${column} in ${itemId}`;
      cell = {
        row: rowNum,
        itemId: itemId,
        column,
        oldValue: oldValues[Math.floor(Math.random() * oldValues.length)],
        newValue: newValues[Math.floor(Math.random() * newValues.length)],
      };
    } else if (action === 'delete') {
      const rowNum = Math.floor(Math.random() * 10) + 1;
      const itemId = generateId(rowNum);
      description = `Deleted ${itemId}`;
    } else {
      // add action
      const rowNum = Math.floor(Math.random() * 10) + 1;
      const itemId = generateId(rowNum);
      description = `Added ${itemId}`;
    }

    history.push({
      id: `history-${i}`,
      user,
      action,
      timestamp,
      description,
      cell,
    });
  }

  // Sort by timestamp (newest first)
  return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export const MOCK_IMPACT_HISTORY = generateFakeHistory('IMP.');
export const MOCK_SCOPE_HISTORY = generateFakeHistory('SCO.');
export const MOCK_CHECKLIST_HISTORY = generateFakeHistory('CHK.');
