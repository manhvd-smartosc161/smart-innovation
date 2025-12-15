export interface ScopeItem {
  scope_id: string;
  system: string;
  component: string;
  element: string;
  description: string;
}

export interface ImpactItem {
  id: string;
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
