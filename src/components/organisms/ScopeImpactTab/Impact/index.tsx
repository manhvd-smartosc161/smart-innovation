import React from 'react';
import { BaseTable } from '../BaseTable';
import { MOCK_IMPACT_DATA } from '@/mock';
import type { ImpactItem } from '@/types';
import './index.scss';

export const Impact: React.FC = () => {
  return (
    <BaseTable<ImpactItem>
      title="Impact"
      tabKey="Impact"
      idPrefix="IMP."
      idLength={5}
      idField="impact_id"
      descriptionField="impact_description"
      initialData={MOCK_IMPACT_DATA}
    />
  );
};
