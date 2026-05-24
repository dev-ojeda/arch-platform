// packages/application/src/generation/telemetry/record-step-metric.ts

import type { GenerationContext, StepExecutionMetric } from '@arch/contracts';

import { publishGenerationEvent } from '../events/publish-generation-event.js';

export async function recordStepMetric(
  context: GenerationContext,

  metric: StepExecutionMetric,
): Promise<void> {
  context.metrics.push(metric);

  await publishGenerationEvent(
    context,

    'STEP_METRIC_RECORDED',

    {
      step: metric.step,

      duration: metric.duration,

      startedAt: metric.startedAt,

      completedAt: metric.finishedAt,
    },
  );
}
