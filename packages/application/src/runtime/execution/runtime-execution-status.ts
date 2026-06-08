// packages/application/src/runtime/execution/runtime-execution-status.ts
import type { ExecutionStatus } from './status/execution-status.js';

export const RuntimeExecutionStatuses = {
  Pending: 'pending',
  Running: 'running',
  Success: 'success',
  Failed: 'failed',
  Cancelled: 'cancelled',
} as const;
export interface StepState {
  stepId: string;
  stepName: string;

  status: 'pending' | 'running' | 'completed' | 'failed';

  startedAt?: number;
  finishedAt?: number;
  durationMs?: number;

  error?: unknown;
}

export interface ExecutionState {
  executionId: string;
  pipelineId: string;

  status: ExecutionStatus;

  startedAt: number;
  finishedAt?: number;
  durationMs?: number;
  error?: unknown;
  steps: Record<string, StepState>;

  stepOrder: string[];
}
export type ExecutionListener = (state: ExecutionState) => void;
export type RuntimeExecutionStatus =
  (typeof RuntimeExecutionStatuses)[keyof typeof RuntimeExecutionStatuses];
