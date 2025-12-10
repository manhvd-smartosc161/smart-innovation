// Mock data for tickets and Confluence pages

import type { Ticket, ConfluencePage } from '@/types';

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'JIRA-001',
    key: 'JIRA-001',
    title: 'Implement user authentication flow',
  },
  {
    id: 'JIRA-002',
    key: 'JIRA-002',
    title: 'Fix payment gateway integration bug',
  },
  {
    id: 'JIRA-003',
    key: 'JIRA-003',
    title: 'Add responsive design for mobile devices',
  },
  {
    id: 'JIRA-004',
    key: 'JIRA-004',
    title: 'Optimize database query performance',
  },
  { id: 'JIRA-005', key: 'JIRA-005', title: 'Update user profile page UI' },
  { id: 'JIRA-006', key: 'JIRA-006', title: 'Implement dark mode theme' },
  { id: 'JIRA-007', key: 'JIRA-007', title: 'Add email notification system' },
  {
    id: 'JIRA-008',
    key: 'JIRA-008',
    title: 'Fix cross-browser compatibility issues',
  },
  {
    id: 'JIRA-009',
    key: 'JIRA-009',
    title: 'Implement file upload functionality',
  },
  { id: 'JIRA-010', key: 'JIRA-010', title: 'Add multi-language support' },
  { id: 'JIRA-011', key: 'JIRA-011', title: 'Create admin dashboard' },
  { id: 'JIRA-012', key: 'JIRA-012', title: 'Implement search functionality' },
  { id: 'JIRA-013', key: 'JIRA-013', title: 'Add data export feature' },
  { id: 'JIRA-014', key: 'JIRA-014', title: 'Fix security vulnerabilities' },
  {
    id: 'JIRA-015',
    key: 'JIRA-015',
    title: 'Implement real-time notifications',
  },
];

export const MOCK_CONFLUENCE_PAGES: ConfluencePage[] = [
  {
    id: 'CONF-001',
    url: 'https://confluence.example.com/display/PROJ/API-Documentation',
    title: 'API Documentation',
  },
  {
    id: 'CONF-002',
    url: 'https://confluence.example.com/display/PROJ/Architecture-Overview',
    title: 'Architecture Overview',
  },
  {
    id: 'CONF-003',
    url: 'https://confluence.example.com/display/PROJ/User-Guide',
    title: 'User Guide',
  },
  {
    id: 'CONF-004',
    url: 'https://confluence.example.com/display/PROJ/Developer-Setup',
    title: 'Developer Setup Guide',
  },
  {
    id: 'CONF-005',
    url: 'https://confluence.example.com/display/PROJ/Testing-Strategy',
    title: 'Testing Strategy',
  },
  {
    id: 'CONF-006',
    url: 'https://confluence.example.com/display/PROJ/Deployment-Guide',
    title: 'Deployment Guide',
  },
  {
    id: 'CONF-007',
    url: 'https://confluence.example.com/display/PROJ/Database-Schema',
    title: 'Database Schema Documentation',
  },
  {
    id: 'CONF-008',
    url: 'https://confluence.example.com/display/PROJ/Security-Guidelines',
    title: 'Security Guidelines',
  },
  {
    id: 'CONF-009',
    url: 'https://confluence.example.com/display/PROJ/Code-Standards',
    title: 'Code Standards and Best Practices',
  },
  {
    id: 'CONF-010',
    url: 'https://confluence.example.com/display/PROJ/Release-Notes',
    title: 'Release Notes',
  },
  {
    id: 'CONF-011',
    url: 'https://confluence.example.com/display/PROJ/Troubleshooting',
    title: 'Troubleshooting Guide',
  },
  {
    id: 'CONF-012',
    url: 'https://confluence.example.com/display/PROJ/Performance-Metrics',
    title: 'Performance Metrics Dashboard',
  },
];
