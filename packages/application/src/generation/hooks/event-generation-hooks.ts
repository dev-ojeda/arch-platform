// packages/application/src/generation/hooks/event-generation-hooks.ts

import type { GenerationContext, GenerationHooks, GenerationPipelineStep } from '@arch/contracts';

import { publishGenerationEvent } from '../events/publish-generation-event.js';

export class EventGenerationHooks implements GenerationHooks {
  async beforePipeline(context: GenerationContext): Promise<void> {
    await publishGenerationEvent(
      context,

      'GENERATION_STARTED',
    );
  }

  async afterPipeline(context: GenerationContext): Promise<void> {
    await publishGenerationEvent(
      context,

      'GENERATION_COMPLETED',
    );
  }

  async beforeStep(
    step: GenerationPipelineStep,

    context: GenerationContext,
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
    step: GenerationPipelineStep,

    context: GenerationContext,
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

    context: GenerationContext,
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
