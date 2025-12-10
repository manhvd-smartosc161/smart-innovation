import type { ImpactItem } from '@/types';

export const MOCK_IMPACT_DATA: ImpactItem[] = [
  {
    id: '1',
    system: 'OMS',
    component: 'queue',
    element: 'order-queue',
    description: 'Order queue processing will be affected',
  },
  {
    id: '2',
    system: 'OMS',
    component: 'database',
    element: 'order-table',
    description: 'Order table schema changes required',
  },
];
