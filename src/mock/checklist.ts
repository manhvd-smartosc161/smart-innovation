import type { ChecklistItem } from '@/types';

export const MOCK_CHECKLIST_DATA: ChecklistItem[] = [
  {
    id: '1',
    element: 'order-queue',
    verification:
      'Verify order queue processes messages correctly after changes',
  },
  {
    id: '2',
    element: 'order-table',
    verification:
      'Verify order table queries return correct data with new schema',
  },
  {
    id: '3',
    element: 'fulfillment-flow',
    verification: 'Verify fulfillment flow completes end-to-end without errors',
  },
];
