// packages/application/src/generation/hooks/composite-generation-hooks.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
} from "@arch/contracts";

export class CompositeGenerationHooks implements GenerationHooks {
  constructor(private readonly hooks: readonly GenerationHooks[]) {}

  async beforePipeline(context: GenerationContext): Promise<void> {
    for (const hook of this.hooks) {
      await hook.beforePipeline?.(context);
    }
  }

  async afterPipeline(context: GenerationContext): Promise<void> {
    for (const hook of this.hooks) {
      await hook.afterPipeline?.(context);
    }
  }

  async beforeStep(
    step: GenerationPipelineStep,

    context: GenerationContext
  ): Promise<void> {
    for (const hook of this.hooks) {
      await hook.beforeStep?.(step, context);
    }
  }

  async afterStep(
    step: GenerationPipelineStep,

    context: GenerationContext
  ): Promise<void> {
    for (const hook of this.hooks) {
      await hook.afterStep?.(step, context);
    }
  }

  async onError(
    error: unknown,

    context: GenerationContext
  ): Promise<void> {
    for (const hook of this.hooks) {
      await hook.onError?.(error, context);
    }
  }
}
