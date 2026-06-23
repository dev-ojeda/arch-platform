// packages/application/src/generation/hooks/event-generation-hooks.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
  TemplateVariables,
} from '@arch/contracts';

import { publishGenerationEvent } from '../../runtime/execution/events/publish-generation-event.js';

export class EventGenerationHooks<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationHooks<TVariables> {
  async beforePipeline(context: GenerationContext<TVariables>): Promise<void> {
    await publishGenerationEvent(
      context,

      'GENERATION_STARTED',
    );
  }

  async afterPipeline(context: GenerationContext<TVariables>): Promise<void> {
    await publishGenerationEvent(
      context,

      'GENERATION_COMPLETED',
    );
  }

  async beforeStep(
    step: GenerationPipelineStep<TVariables>,

    context: GenerationContext<TVariables>,
  ): Promise<void> {
    await publishGenerationEvent(
      context,

      'STEP_STARTED',

      {
        step: step.name,
      },
    );
  }

  async afterStep(
    step: GenerationPipelineStep<TVariables>,

    context: GenerationContext<TVariables>,
  ): Promise<void> {
    await publishGenerationEvent(
      context,

      'STEP_COMPLETED',

      {
        step: step.name,
      },
    );
  }

  async onError(
    error: unknown,

    context: GenerationContext<TVariables>,
  ): Promise<void> {
    await publishGenerationEvent(
      context,

      'GENERATION_FAILED',

      {
        error: error instanceof Error ? error.message : String(error),
      },
    );
  }
}
