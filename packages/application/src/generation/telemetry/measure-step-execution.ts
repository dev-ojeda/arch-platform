// packages/application/src/generation/telemetry/measure-step-execution.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

import { recordStepMetric } from './record-step-metric.js';

export async function measureStepExecution<
  TVariables extends TemplateVariables = TemplateVariables,
>(
  context: GenerationContext<TVariables>,
  step: GenerationPipelineStep<TVariables>,
  execution: () => Promise<void>,
): Promise<void> {
  const startedAt = performance.now();

  await execution();

  const completedAt = performance.now();

  await recordStepMetric(context, {
    step: step.name,
    startedAt,
    finishedAt: completedAt,
    duration: completedAt - startedAt,
  });
}
