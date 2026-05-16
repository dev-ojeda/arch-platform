
import type {
  GenerationPipelineStep,
  GeneratorDefinition,
  PipelineContext
} from '@arch/contracts'
import { InMemoryGeneratorRegistry } from '../registry/in-memory-generator-registry.js'
import { GenerationPipeline } from '../pipeline/generation-pipeline.js'
import { LoadGeneratorStep } from '../steps/load-generator.step.js'


export class TestPipelineBuilder {

  private readonly steps:
  GenerationPipelineStep[] = []

  private readonly registry =
    new InMemoryGeneratorRegistry()

  private readonly context:
  PipelineContext = {

    generatorId:
      'test-generator',

    workspacePath:
      '/virtual-workspace',

    variables: {}
  }

  withGenerator(
    generator:
    GeneratorDefinition
  ): this {

    this.registry.register(
      generator
    )

    this.context.generatorId =
      generator.descriptor.id

    return this
  }

  withVariables(
    variables:
    Record<string, unknown>
  ): this {

    this.context.variables =
      variables

    return this
  }

  withStep(
    step:
    GenerationPipelineStep
  ): this {

    this.steps.push(
      step
    )

    return this
  }

  async execute():
  Promise<PipelineContext> {

    const pipeline =
      new GenerationPipeline([

        new LoadGeneratorStep(
          this.registry
        ),

        ...this.steps
      ])

    await pipeline.execute(
      this.context
    )

    return this.context
  }
}