// Mock data for Scope, Impact, and Checklist tabs (simulating API response)

export const SYSTEMS = [
  { value: 'SOSC', label: 'SOSC' },
  { value: 'OMS', label: 'OMS' },
  { value: 'WMS', label: 'WMS' },
  { value: 'TMS', label: 'TMS' },
  { value: 'PMS', label: 'PMS' },
  { value: 'CMS', label: 'CMS' },
];

export const COMPONENTS = [
  { value: 'queue', label: 'Queue' },
  { value: 'cronjob', label: 'Cronjob' },
  { value: 'config', label: 'Config' },
  { value: 'database', label: 'Database' },
  { value: 'flow', label: 'Flow' },
];

export const ELEMENTS_BY_COMPONENT: Record<
  string,
  Array<{ value: string; label: string }>
> = {
  queue: [
    { value: 'order-queue', label: 'Order Queue' },
    { value: 'payment-queue', label: 'Payment Queue' },
    { value: 'notification-queue', label: 'Notification Queue' },
    { value: 'inventory-queue', label: 'Inventory Queue' },
    { value: 'shipping-queue', label: 'Shipping Queue' },
    { value: 'refund-queue', label: 'Refund Queue' },
    { value: 'sync-queue', label: 'Sync Queue' },
  ],
  cronjob: [
    { value: 'daily-report', label: 'Daily Report' },
    { value: 'data-backup', label: 'Data Backup' },
    { value: 'cleanup-task', label: 'Cleanup Task' },
    { value: 'sync-task', label: 'Sync Task' },
    { value: 'notification-sender', label: 'Notification Sender' },
    { value: 'inventory-update', label: 'Inventory Update' },
    { value: 'order-processor', label: 'Order Processor' },
  ],
  config: [
    { value: 'api-timeout', label: 'API Timeout' },
    { value: 'max-retry-count', label: 'Max Retry Count' },
    { value: 'batch-size', label: 'Batch Size' },
    { value: 'cache-ttl', label: 'Cache TTL' },
    { value: 'rate-limit', label: 'Rate Limit' },
    { value: 'connection-pool-size', label: 'Connection Pool Size' },
    { value: 'log-level', label: 'Log Level' },
    { value: 'feature-flags', label: 'Feature Flags' },
  ],
  database: [
    { value: 'user-table', label: 'User Table' },
    { value: 'order-table', label: 'Order Table' },
    { value: 'product-table', label: 'Product Table' },
    { value: 'inventory-table', label: 'Inventory Table' },
    { value: 'payment-table', label: 'Payment Table' },
    { value: 'transaction-table', label: 'Transaction Table' },
    { value: 'audit-log-table', label: 'Audit Log Table' },
  ],
  flow: [
    { value: 'order-flow', label: 'Order Flow' },
    { value: 'payment-flow', label: 'Payment Flow' },
    { value: 'fulfillment-flow', label: 'Fulfillment Flow' },
    { value: 'return-flow', label: 'Return Flow' },
    { value: 'refund-flow', label: 'Refund Flow' },
    { value: 'approval-flow', label: 'Approval Flow' },
    { value: 'notification-flow', label: 'Notification Flow' },
  ],
};

import type { ScopeItem } from '@/types';

export const MOCK_SCOPE_DATA: ScopeItem[] = [
  {
    id: '1',
    system: 'OMS',
    component: 'queue',
    element: 'order-queue',
    description: 'Order processing queue for handling customer orders',
  },
  {
    id: '2',
    system: 'OMS',
    component: 'database',
    element: 'order-table',
    description: 'Main order table storing all order information',
  },
  {
    id: '3',
    system: 'WMS',
    component: 'flow',
    element: 'fulfillment-flow',
    description: 'Workflow for order fulfillment and shipping',
  },
  {
    id: '4',
    system: 'SOSC',
    component: 'config',
    element: 'api-timeout',
    description: 'API timeout configuration for external service calls',
  },
];
