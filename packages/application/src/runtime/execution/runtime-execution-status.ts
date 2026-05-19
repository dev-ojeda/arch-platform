// packages/application/src/runtime/execution/runtime-execution-status.ts
export const RuntimeExecutionStatuses = {
  Pending: "pending",
  Running: "running",
  Success: "success",
  Failed: "failed",
  Cancelled: "cancelled",
} as const;

export type RuntimeExecutionStatus =
  (typeof RuntimeExecutionStatuses)[keyof typeof RuntimeExecutionStatuses];
