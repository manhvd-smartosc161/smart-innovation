import React from 'react';
import { BaseTable } from '../BaseTable';
import { MOCK_IMPACT_DATA } from '@/mock';
import type { ImpactItem } from '@/types';
import './index.scss';

interface ImpactProps {
  disabled?: boolean;
  onDataChange?: (data: ImpactItem[]) => void;
  onSaveRef?: React.Ref<{ save: () => void }>;
  isActionHidden?: boolean;
}

export const Impact: React.FC<ImpactProps> = ({
  disabled,
  onDataChange,
  onSaveRef,
  isActionHidden,
}) => {
  return (
    <BaseTable<ImpactItem>
      title="Impact"
      tabKey="Impact"
      idPrefix="IMP."
      idLength={5}
      idField="impact_id"
      descriptionField="impact_description"
      initialData={MOCK_IMPACT_DATA}
      disabled={disabled}
      onDataChange={onDataChange}
      onSaveRef={onSaveRef}
      isActionHidden={isActionHidden}
    />
  );
};
