import type { ConfluencePageTree } from '@/types/confluence';

export const MOCK_CONFLUENCE_PAGES_TREE: ConfluencePageTree[] = [
  {
    id: 'home',
    title: 'Home',
    type: 'folder',
    lastUpdate: 'May 05, 16:27',
    children: [
      {
        id: 'sosc',
        title: 'Smart Open Solution Center',
        type: 'folder',
        lastUpdate: 'Nov 12, 15:11',
        children: [
          {
            id: 'smart-workspace',
            title: 'Smart workspace',
            type: 'folder',
            lastUpdate: 'Nov 12, 15:10',
            children: [
              {
                id: 'integration-management',
                title: 'Integration Management',
                url: 'https://confluence.example.com/display/PROJ/Integration-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:36',
              },
              {
                id: 'diagram-management',
                title: 'Diagram Management',
                url: 'https://confluence.example.com/display/PROJ/Diagram-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:13',
              },
              {
                id: 'project-management',
                title: 'Project Management',
                url: 'https://confluence.example.com/display/PROJ/Project-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:35',
              },
              {
                id: 'test-management',
                title: 'Test Management',
                url: 'https://confluence.example.com/display/PROJ/Test-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:26',
              },
              {
                id: 'request-management',
                title: 'Request Management',
                url: 'https://confluence.example.com/display/PROJ/Request-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:34',
              },
            ],
          },
          {
            id: 'knowledge-library',
            title: 'Knowledge Library',
            type: 'folder',
            lastUpdate: 'Nov 12, 15:32',
            children: [
              {
                id: 'collection-management',
                title: 'Collection Management',
                url: 'https://confluence.example.com/display/PROJ/Collection-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:37',
              },
              {
                id: 'system-management',
                title: 'System Management',
                url: 'https://confluence.example.com/display/PROJ/System-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:36',
              },
              {
                id: 'module-management',
                title: 'Module Management',
                url: 'https://confluence.example.com/display/PROJ/Module-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:36',
              },
              {
                id: 'api-management',
                title: 'API Management',
                url: 'https://confluence.example.com/display/PROJ/API-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:36',
              },
              {
                id: 'brd-management',
                title: 'BRD Management',
                url: 'https://confluence.example.com/display/PROJ/BRD-Management',
                type: 'page',
                lastUpdate: 'Nov 12, 15:38',
              },
            ],
          },
          {
            id: 'integration-hub',
            title: 'Integration Hub',
            type: 'folder',
            lastUpdate: 'Nov 12, 15:33',
            children: [
              {
                id: 'nest-of-ants',
                title: 'Nest of Ants',
                url: 'https://confluence.example.com/display/PROJ/Nest-of-Ants',
                type: 'page',
                lastUpdate: 'Nov 12, 15:35',
              },
            ],
          },
        ],
      },
    ],
  },
];
