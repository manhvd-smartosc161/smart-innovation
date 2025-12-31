import React from 'react';
import { BaseTable } from '../BaseTable';
import { MOCK_SCOPE_DATA } from '@/mock';
import type { ScopeItem } from '@/types';
import './index.scss';

export const Scope: React.FC = () => {
  return (
    <BaseTable<ScopeItem>
      title="Scope"
      tabKey="Scope"
      idPrefix="SCO."
      idLength={5}
      idField="scope_id"
      descriptionField="scope_description"
      initialData={MOCK_SCOPE_DATA}
    />
  );
};
