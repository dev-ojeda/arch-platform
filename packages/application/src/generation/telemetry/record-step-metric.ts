// packages/application/src/generation/telemetry/record-step-metric.ts

import type { GenerationContext, StepExecutionMetric } from "@arch/contracts";

export function recordStepMetric(
  context: GenerationContext,

  metric: StepExecutionMetric
): void {
  context.metrics.push(metric);
}
