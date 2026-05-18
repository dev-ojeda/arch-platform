// packages\application\testing\test-pipeline-builder.ts

import type {

  GenerationPipelineStep,

  GeneratorDefinition,

  PipelineContext,

  NamedVariables

}
from '@arch/contracts'


import {
  InMemoryGeneratorRegistry
}
from '../src/generation/registry/in-memory-generator-registry.js'

import {
  GenerationPipeline
}
from '../src/generation/pipeline/generation-pipeline.js'

import {
  LoadGeneratorStep
}
from '../src/generation/steps/load-generator.step.js'

import {
  ValidateGeneratorStep
}
from '../src/generation/steps/validate-generator.step.js'

import { createTestContext } from '@arch/testing'

export class TestPipelineBuilder {

  private readonly steps:
  GenerationPipelineStep[] = []

  private readonly registry =
    new InMemoryGeneratorRegistry()

  private context =
    this.createContext()

  private createContext():
  PipelineContext {

    return {

      ...createTestContext(),

      generatorId:
        'test-generator'
    }
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
    NamedVariables
  ): this {

    this.context = {

      ...this.context,

      variables
    }

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

  private createDefaultSteps():
  GenerationPipelineStep[] {

    return [

      new LoadGeneratorStep(
        this.registry
      ),

      new ValidateGeneratorStep()
    ]
  }

  async execute():
  Promise<PipelineContext> {

    const pipeline =
      new GenerationPipeline([

        ...this.createDefaultSteps(),

        ...this.steps
      ])

    await pipeline.execute(
      this.context
    )

    return this.context
  }
}