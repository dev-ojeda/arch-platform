// packages/application/src/generation/steps/resolve-variables.step.ts

import type {
  GenerationPipelineStep,
  PipelineContext
}
from '@arch/contracts'

import {
  deriveTemplateVariables
}
from '../variables/derive-template-variables.js'

export class ResolveVariablesStep
implements GenerationPipelineStep {

  async execute(
    context: PipelineContext
  ): Promise<void> {

    context.resolvedVariables =
      deriveTemplateVariables(

        context.variables
      )
  }
}