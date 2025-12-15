export interface ScopeItem {
  scope_id: string;
  system: string;
  component: string;
  element: string;
  description: string;
}

export interface ImpactItem {
  impact_id: string;
  system: string;
  component: string;
  element: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  element: string;
  verification: string;
}
