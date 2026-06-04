// packages/application/src/runtime/execution/status/execution-status.ts

export const ExecutionStatus = {
  Pending: 'pending',
  Running: 'running',
  Success: 'success',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;

export type ExecutionStatus = (typeof ExecutionStatus)[keyof typeof ExecutionStatus];
