import type { ImpactItem } from '@/types';

export const MOCK_IMPACT_DATA: ImpactItem[] = [
  {
    impact_id: 'IMP.00001',
    system: 'OMS',
    component: 'queue',
    element: 'order-queue',
    description: 'Order queue processing will be affected',
  },
  {
    impact_id: 'IMP.00002',
    system: 'OMS',
    component: 'database',
    element: 'order-table',
    description: 'Order table schema changes required',
  },
];
