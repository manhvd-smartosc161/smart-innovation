import type { ChecklistItem } from '@/types';

export const MOCK_CHECKLIST_DATA: ChecklistItem[] = [
  {
    checklist_id: 'CL.00001',
    type: 'Scope',
    item: 'SCO.00001',
    description:
      'Verify order queue processes messages correctly after changes',
  },
  {
    checklist_id: 'CL.00002',
    type: 'Impact',
    item: 'IMP.00001',
    description: 'Verify impact on order queue processing',
  },
  {
    checklist_id: 'CL.00003',
    type: 'Scope',
    item: 'SCO.00002',
    description:
      'Verify order table queries return correct data with new schema',
  },
];
