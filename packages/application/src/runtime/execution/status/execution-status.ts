// packages/application/src/runtime/execution/status/execution-status.ts

export const EXECUTION_STATUS = {
  Pending: 'pending',
  Running: 'running',
  Success: 'success',
  Completed: 'completed',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;

export type ExecutionStatus = (typeof EXECUTION_STATUS)[keyof typeof EXECUTION_STATUS];
