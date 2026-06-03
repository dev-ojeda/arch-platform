// packages/application/src/runtime/execution/timeline/execution-timeline-step.ts

import type { ExecutionStatus } from '../status/execution-status.js';

export interface ExecutionTimelineStep {
  readonly stepId: string;

  readonly stepName: string;

  readonly status: ExecutionStatus;

  readonly startedAt?: number;

  readonly finishedAt?: number;

  readonly durationMs?: number;

  readonly error?: unknown;
}
