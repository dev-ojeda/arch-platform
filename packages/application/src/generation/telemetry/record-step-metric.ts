// packages/application/src/generation/telemetry/record-step-metric.ts

import type { GenerationContext, StepExecutionMetric, TemplateVariables } from '@arch/contracts';

import { publishGenerationEvent } from '../../runtime/execution/events/publish-generation-event.js';

export async function recordStepMetric<TVariables extends TemplateVariables = TemplateVariables>(
  context: GenerationContext<TVariables>,
  metric: StepExecutionMetric,
): Promise<void> {
  context.metrics.push(metric);

  await publishGenerationEvent(context, 'STEP_METRIC_RECORDED', {
    duration: metric.duration,
    startedAt: metric.startedAt,
    completedAt: metric.finishedAt,
  });
}
