// packages/application/src/runtime/timeline/execution-timeline.ts
import type { StepTimeline } from './step-timeline.js';

export interface ExecutionTimeline {
  executionId: string;

  pipelineId: string;

  startedAt?: number;

  finishedAt?: number;

  durationMs?: number;

  steps: StepTimeline[];
}
