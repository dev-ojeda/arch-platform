// packages/testing/src/runtime/create-test-execution-context.ts
export interface RuntimeExecutionContext {
  readonly executionId: string;

  readonly pipelineId: string;

  readonly startedAt: number;

  readonly metadata?: Record<string, unknown>;
}
export function createTestExecutionContext(
  overrides: Partial<RuntimeExecutionContext> = {},
): RuntimeExecutionContext {
  return {
    executionId: 'execution-1',

    pipelineId: 'test-pipeline',

    startedAt: Date.now(),

    metadata: {},

    ...overrides,
  };
}
