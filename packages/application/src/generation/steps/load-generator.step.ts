import type {
  GenerationPipelineStep,
  GeneratorRegistry,
  PipelineContext
} from '@arch/contracts'


export class LoadGeneratorStep
implements GenerationPipelineStep {

  constructor(
    private readonly registry:
    GeneratorRegistry
  ) {}

  async execute(
    context: PipelineContext
  ): Promise<void> {

    context.generator =
      await this.registry.get(
        context.generatorId
      )
  }
}