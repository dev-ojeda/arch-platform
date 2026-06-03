// packages/application/src/generation/hooks/telemetry-generation-hooks.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { GenerationHooks } from '@arch/contracts/hooks';
import type { TemplateVariables } from '@arch/contracts/variables';

import { recordStepMetric } from '../telemetry/record-step-metric.js';

export class TelemetryGenerationHooks<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationHooks<TVariables> {
  readonly #startedAt = new Map<string, number>();

  beforeStep(
    step: GenerationPipelineStep<TVariables>,
    _context: GenerationContext<TVariables>,
  ): Promise<void> {
    this.#startedAt.set(step.name, Date.now());

    return Promise.resolve();
  }

  async afterStep(
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void> {
    const startedAt = this.#startedAt.get(step.name);

    if (startedAt === undefined) {
      return;
    }

    const finishedAt = Date.now();

    await recordStepMetric(context, {
      step: step.name,
      startedAt,
      finishedAt,
      duration: finishedAt - startedAt,
    });
  }
}
