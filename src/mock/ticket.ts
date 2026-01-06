// Mock data for tickets grouped by status

import type { Ticket } from '@/types';

// Drafting tickets
export const DRAFTING_TICKETS: Ticket[] = [
  {
    id: 'SAIT-000001',
    key: 'SAIT-000001',
    title: 'Implement user authentication flow',
    description:
      'Implement a secure user authentication system with login, logout, and session management.',
  },
  {
    id: 'SAIT-000002',
    key: 'SAIT-000002',
    title: 'Fix payment gateway integration bug',
    description:
      'Resolve the issue where payment transactions fail intermittently.',
  },
  {
    id: 'SAIT-000003',
    key: 'SAIT-000003',
    title: 'Add responsive design for mobile devices',
    description:
      'Ensure the application is fully responsive across all mobile devices.',
  },
  {
    id: 'SAIT-000004',
    key: 'SAIT-000004',
    title: 'Optimize database query performance',
    description: 'Analyze and optimize slow database queries.',
  },
  {
    id: 'SAIT-000005',
    key: 'SAIT-000005',
    title: 'Update user profile page UI',
    description:
      'Redesign the user profile page with a modern, clean interface.',
  },
];

// Reviewing tickets
export const REVIEWING_TICKETS: Ticket[] = [
  {
    id: 'SAIT-000006',
    key: 'SAIT-000006',
    title: 'Implement dark mode theme',
    description: 'Add a dark mode theme option that users can toggle.',
  },
  {
    id: 'SAIT-000007',
    key: 'SAIT-000007',
    title: 'Add email notification system',
    description: 'Implement an email notification system for important events.',
  },
  {
    id: 'SAIT-000008',
    key: 'SAIT-000008',
    title: 'Fix cross-browser compatibility issues',
    description:
      'Resolve rendering and functionality issues in Safari and older versions of Edge.',
  },
  {
    id: 'SAIT-000009',
    key: 'SAIT-000009',
    title: 'Implement file upload functionality',
    description: 'Add file upload capability with drag-and-drop support.',
  },
];

// Cancelled tickets
export const CANCELLED_TICKETS: Ticket[] = [
  {
    id: 'SAIT-000010',
    key: 'SAIT-000010',
    title: 'Add multi-language support',
    description:
      'Implement internationalization (i18n) to support multiple languages.',
  },
  {
    id: 'SAIT-000011',
    key: 'SAIT-000011',
    title: 'Create admin dashboard',
    description: 'Build a comprehensive admin dashboard with analytics.',
  },
  {
    id: 'SAIT-000012',
    key: 'SAIT-000012',
    title: 'Implement advanced search functionality',
    description: 'Add a powerful search feature with filters and autocomplete.',
  },
];

// Rejected tickets
export const REJECTED_TICKETS: Ticket[] = [
  {
    id: 'SAIT-000013',
    key: 'SAIT-000013',
    title: 'Add data export feature',
    description: 'Allow users to export their data in various formats.',
  },
  {
    id: 'SAIT-000014',
    key: 'SAIT-000014',
    title: 'Fix security vulnerabilities',
    description:
      'Address security vulnerabilities identified in the latest security audit.',
  },
  {
    id: 'SAIT-000015',
    key: 'SAIT-000015',
    title: 'Implement chat feature',
    description: 'Add real-time chat functionality for user communication.',
  },
];

// Resolved tickets
export const RESOLVED_TICKETS: Ticket[] = [
  {
    id: 'SAIT-000016',
    key: 'SAIT-000016',
    title: 'Implement real-time notifications',
    description: 'Add real-time notification system using WebSockets.',
  },
  {
    id: 'SAIT-000017',
    key: 'SAIT-000017',
    title: 'Add two-factor authentication',
    description: 'Implement 2FA for enhanced security.',
  },
  {
    id: 'SAIT-000018',
    key: 'SAIT-000018',
    title: 'Create API documentation',
    description: 'Generate comprehensive API documentation with examples.',
  },
  {
    id: 'SAIT-000019',
    key: 'SAIT-000019',
    title: 'Implement rate limiting',
    description: 'Add rate limiting to prevent API abuse.',
  },
];

// Approved tickets
export const APPROVED_TICKETS: Ticket[] = [
  {
    id: 'SAIT-000020',
    key: 'SAIT-000020',
    title: 'Deploy to production environment',
    description: 'Deploy the latest version to production with zero downtime.',
  },
  {
    id: 'SAIT-000021',
    key: 'SAIT-000021',
    title: 'Set up monitoring and alerting',
    description: 'Configure monitoring tools and alert systems.',
  },
  {
    id: 'SAIT-000022',
    key: 'SAIT-000022',
    title: 'Implement backup strategy',
    description: 'Set up automated backup and disaster recovery procedures.',
  },
];

// Object mapping for easy access
export const MOCK_TICKETS_BY_STATUS = {
  Drafting: DRAFTING_TICKETS,
  Reviewing: REVIEWING_TICKETS,
  Cancelled: CANCELLED_TICKETS,
  Rejected: REJECTED_TICKETS,
  Resolved: RESOLVED_TICKETS,
  Approved: APPROVED_TICKETS,
};

export const MOCK_TICKETS: Ticket[] = [
  ...DRAFTING_TICKETS,
  ...REVIEWING_TICKETS,
  ...CANCELLED_TICKETS,
  ...REJECTED_TICKETS,
  ...RESOLVED_TICKETS,
  ...APPROVED_TICKETS,
];
