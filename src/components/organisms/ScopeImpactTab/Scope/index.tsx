import React from 'react';
import { BaseTable } from '../BaseTable';
import { MOCK_SCOPE_DATA } from '@/mock';
import type { ScopeItem } from '@/types';
import './index.scss';

interface ScopeProps {
  disabled?: boolean;
  onDataChange?: (data: ScopeItem[]) => void;
  onSaveRef?: React.Ref<{ save: () => void }>;
}

export const Scope: React.FC<ScopeProps> = ({
  disabled,
  onDataChange,
  onSaveRef,
}) => {
  return (
    <BaseTable<ScopeItem>
      title="Scope"
      tabKey="Scope"
      idPrefix="SCO."
      idLength={5}
      idField="scope_id"
      descriptionField="scope_description"
      initialData={MOCK_SCOPE_DATA}
      disabled={disabled}
      onDataChange={onDataChange}
      onSaveRef={onSaveRef}
    />
  );
};
