// packages/application/src/generation/engine/pipeline/generation-pipeline.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
} from "@arch/contracts";

export class GenerationPipeline {
  constructor(private readonly steps: readonly GenerationPipelineStep[]) {}

  async execute(context: GenerationContext): Promise<void> {
    for (const step of this.steps) {
      await step.execute(context);
    }
  }
}
