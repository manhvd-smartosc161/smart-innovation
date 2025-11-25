export interface ExpectedResult {
  id: number;
  description: string;
}

export interface TestStep {
  id: number;
  stepNumber: number;
  description: string;
  expectedResults: ExpectedResult[];
}

export interface TestCase {
  id: string;
  title: string;
  description: string;
  steps: TestStep[];
}

export interface TreeNode {
  key: string;
  title: string;
  type: "folder" | "file";
  children?: TreeNode[];
  isLeaf?: boolean;
}

export type TabType =
  | "Drafting"
  | "Reviewing"
  | "Cancelled"
  | "Rejected"
  | "Resolved"
  | "Approved";
