export interface ScopeItem {
  scope_id: string;
  system: string;
  component: string;
  element: string;
  scope_description: string;
}

export interface ImpactItem {
  impact_id: string;
  system: string;
  component: string;
  element: string;
  impact_description: string;
}

export interface ChecklistItem {
  checklist_id: string;
  type: 'Scope' | 'Impact' | '';
  item: string;
  cl_description: string;
}
