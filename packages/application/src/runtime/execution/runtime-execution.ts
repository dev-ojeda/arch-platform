// packages/application/src/runtime/execution/runtime-execution.ts
import type { GenerationDiagnostic, StepExecutionMetric } from '@arch/contracts';

import type { RuntimeExecutionStatus } from './runtime-execution-status.js';
import type { ExecutionTimeline } from './timeline/execution-timeline.js';

export interface RuntimeExecution {
  executionId: string;

  pipelineId: string;

  status: RuntimeExecutionStatus;

  startedAt: number;

  finishedAt?: number;

  durationMs?: number;

  timeline?: ExecutionTimeline;

  diagnostics: readonly GenerationDiagnostic[];

  metrics: readonly StepExecutionMetric[];

  metadata: ReadonlyMap<string, unknown>;
}
