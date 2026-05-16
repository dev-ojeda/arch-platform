import type { GenerationPipelineStep, PipelineContext } from "@arch/contracts";

export class GenerationPipeline {

  constructor(
    private readonly steps:
    readonly GenerationPipelineStep[]
  ) {}

  async execute(
    context: PipelineContext
  ): Promise<void> {

    for (const step of this.steps) {

      await step.execute(
        context
      )
    }
  }
}