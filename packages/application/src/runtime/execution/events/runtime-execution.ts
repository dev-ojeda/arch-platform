// packages/application/src/runtime/execution/events/runtime-execution.ts

import type { ExecutionStatus } from '../status/execution-status.js';
import type { ExecutionTimeline } from '../timeline/execution-timeline.js';

export interface RuntimeExecution {
  readonly executionId: string;

  readonly pipelineId: string;

  readonly status: ExecutionStatus;

  readonly startedAt?: number;

  readonly finishedAt?: number;

  readonly durationMs?: number;

  readonly timeline?: ExecutionTimeline;

  readonly error?: unknown;

  readonly metadata?: Record<string, unknown>;
}
