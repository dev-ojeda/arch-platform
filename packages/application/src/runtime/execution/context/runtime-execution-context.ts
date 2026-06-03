// packages/application/src/runtime/execution/context/runtime-execution-context.ts

export interface RuntimeExecutionContext {
  readonly executionId: string;

  readonly pipelineId: string;

  readonly startedAt: number;

  readonly metadata?: Record<string, unknown>;
}
