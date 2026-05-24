// packages/application/src/generation/hooks/telemetry-generation-hooks.ts

import type { GenerationContext, GenerationHooks, GenerationPipelineStep } from '@arch/contracts';

import { recordStepMetric } from '../telemetry/record-step-metric.js';

export class TelemetryGenerationHooks implements GenerationHooks {
  private readonly startedAt = new Map<string, number>();

  async beforeStep(
    step: GenerationPipelineStep,

    _context: GenerationContext,
  ): Promise<void> {
    this.startedAt.set(
      step.name,

      Date.now(),
    );
  }

  async afterStep(
    step: GenerationPipelineStep,

    context: GenerationContext,
  ): Promise<void> {
    const startedAt = this.startedAt.get(step.name);

    if (!startedAt) {
      return;
    }

    const finishedAt = Date.now();

    recordStepMetric(
      context,

      {
        step: step.name,

        startedAt,

        finishedAt,

        duration: finishedAt - startedAt,
      },
    );
  }
}
