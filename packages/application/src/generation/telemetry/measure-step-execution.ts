// packages/application/src/generation/telemetry/measure-step-execution.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
  TemplateVariables,
} from '@arch-platform/contracts';

import { recordStepMetric } from './record-step-metric.js';

export async function measureStepExecution<
  TVariables extends TemplateVariables = TemplateVariables,
>(
  context: GenerationContext<TVariables>,
  step: GenerationPipelineStep<TVariables>,
  execution: () => Promise<void>,
): Promise<void> {
  const startedAt = performance.now();

  let executionError: unknown;
  let hasExecutionError = false;

  try {
    await execution();
  } catch (error) {
    executionError = error;
    hasExecutionError = true;
  }

  const finishedAt = performance.now();

  try {
    await recordStepMetric(context, {
      step: step.name,
      startedAt,
      finishedAt,
      duration: finishedAt - startedAt,
    });
  } catch (metricError) {
    if (!hasExecutionError) {
      throw metricError;
    }
  }

  if (hasExecutionError) {
    throw executionError;
  }
}
