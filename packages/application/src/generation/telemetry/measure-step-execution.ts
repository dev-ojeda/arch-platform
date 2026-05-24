// packages/application/src/generation/telemetry/measure-step-execution.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts';

import { recordStepMetric } from './record-step-metric.js';

export async function measureStepExecution(
  context: GenerationContext,

  step: GenerationPipelineStep,

  execution: () => Promise<void>,
): Promise<void> {
  const startedAt = performance.now();

  await execution();

  const completedAt = performance.now();

  recordStepMetric(
    context,

    {
      step: step.name,

      startedAt,

      finishedAt: completedAt,

      duration: completedAt - startedAt,
    },
  );
}
