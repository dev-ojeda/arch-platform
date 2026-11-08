// packages/application/src/runtime/execution/timeline/execution-timeline.ts

import type { ExecutionTimelineStep } from './execution-timeline-step.js';
import type { ExecutionStatus } from '../status/execution-status.js';


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
