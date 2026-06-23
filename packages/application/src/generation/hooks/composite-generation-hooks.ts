// packages/application/src/generation/hooks/composite-generation-hooks.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
  TemplateVariables,
} from '@arch/contracts';

export class CompositeGenerationHooks<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationHooks<TVariables> {
  constructor(private readonly hooks: readonly GenerationHooks<TVariables>[]) {}

  async beforePipeline(context: GenerationContext<TVariables>): Promise<void> {
    for (const hook of this.hooks) {
      await hook.beforePipeline?.(context);
    }
  }

  async afterPipeline(context: GenerationContext<TVariables>): Promise<void> {
    for (const hook of this.hooks) {
      await hook.afterPipeline?.(context);
    }
  }

  async beforeStep(
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void> {
    for (const hook of this.hooks) {
      await hook.beforeStep?.(step, context);
    }
  }

  async afterStep(
    step: GenerationPipelineStep<TVariables>,
    context: GenerationContext<TVariables>,
  ): Promise<void> {
    for (const hook of this.hooks) {
      await hook.afterStep?.(step, context);
    }
  }

  async onError(error: unknown, context: GenerationContext<TVariables>): Promise<void> {
    for (const hook of this.hooks) {
      await hook.onError?.(error, context);
    }
  }
}
