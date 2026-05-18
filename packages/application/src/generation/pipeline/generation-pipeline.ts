// packages/application/src/generation/pipeline/generation-pipeline.ts

import type {
  GenerationContext,
  GenerationHooks,
  GenerationPipelineStep,
} from "@arch/contracts";

export class GenerationPipeline {
  constructor(
    private readonly steps: readonly GenerationPipelineStep[],

    private readonly hooks?: GenerationHooks
  ) {}

  async execute(context: GenerationContext): Promise<void> {
    try {
      await this.hooks?.beforePipeline?.(context);

      for (const step of this.steps) {
        await this.hooks?.beforeStep?.(step, context);

        await step.execute(context);

        await this.hooks?.afterStep?.(step, context);
      }

      await this.hooks?.afterPipeline?.(context);
    } catch (error) {
      await this.hooks?.onError?.(error, context);

      throw error;
    }
  }
}
