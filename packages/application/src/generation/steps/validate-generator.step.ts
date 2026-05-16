import type {
  GenerationPipelineStep,
  PipelineContext
}
from '@arch/contracts'

import {
  GeneratorValidationError
}
from '../errors/generator-validation-error.js'

export class ValidateGeneratorStep
implements GenerationPipelineStep {

  async execute(
    context: PipelineContext
  ): Promise<void> {

    const generator =
      context.generator

    if (!generator) {

      throw new GeneratorValidationError(

        'Generator not loaded'
      )
    }

    if (!generator.descriptor) {

      throw new GeneratorValidationError(

        'Generator descriptor missing'
      )
    }

    if (!generator.templates) {

      throw new GeneratorValidationError(

        'Generator templates missing'
      )
    }
  }
}