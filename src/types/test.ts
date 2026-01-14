export type AssertionType =
  | 'field_value'
  | 'response_time'
  | 'status_code'
  | 'data_format'
  | 'custom';

export type AssertionOperator =
  | 'equals' | 'not_equals'
  | 'greater_than' | 'less_than'
  | 'contains' | 'not_contains'
  | 'matches_regex';

export interface Assertion {
  id: string;
  type: AssertionType;
  field?: string;
  operator: AssertionOperator;
  expectedValue: any;
  description?: string;
}

export interface TestStep {
  id: string;
  order: number;
  action: 'send' | 'receive' | 'wait' | 'connect' | 'disconnect';
  data?: any;
  waitTime?: number;
  timeout?: number;
}

export interface TestCase {
  id: string;
  name: string;
  protocolId: string;
  connectionId: string;
  description?: string;
  steps: TestStep[];
  assertions: Assertion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StepResult {
  stepId: string;
  status: 'success' | 'failed' | 'error';
  startTime: Date;
  endTime: Date;
  data?: any;
  error?: string;
}

export interface AssertionResult {
  assertionId: string;
  passed: boolean;
  actualValue?: any;
  expectedValue?: any;
  error?: string;
}

export interface TestResult {
  testCaseId: string;
  startTime: Date;
  endTime: Date;
  status: 'passed' | 'failed' | 'error';
  steps: StepResult[];
  assertions: AssertionResult[];
  summary: {
    totalSteps: number;
    passedSteps: number;
    failedSteps: number;
    totalAssertions: number;
    passedAssertions: number;
    failedAssertions: number;
  };
}
