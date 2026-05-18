// packages\application\src\generation\steps\resolve-templates.step.ts
import type {
  GenerationPipelineStep,
  PipelineContext,
  ResolvedTemplate
}
from '@arch/contracts'

import {
  GeneratorValidationError
}
from '../errors/generator-validation-error.js'

export class ResolveTemplatesStep
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
    
    const resolved:
    ResolvedTemplate[] =

      generator.templates.map(
        template => ({

          template,

          outputPath:
            template.output
        })
      )

    context.resolvedTemplates =
      resolved
  }
}