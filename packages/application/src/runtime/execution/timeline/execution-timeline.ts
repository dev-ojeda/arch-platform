// packages/application/src/runtime/execution/timeline/execution-timeline.ts

import type { ExecutionStatus } from '../status/execution-status.js';

import type { ExecutionTimelineStep } from './execution-timeline-step.js';

export interface ExecutionTimeline {
  readonly executionId: string;

  readonly pipelineId: string;

  readonly status: ExecutionStatus;

  readonly startedAt?: number;

  readonly finishedAt?: number;

  readonly durationMs?: number;

  readonly error?: unknown;

  readonly steps: readonly ExecutionTimelineStep[];
}
