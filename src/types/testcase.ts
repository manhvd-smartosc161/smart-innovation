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
