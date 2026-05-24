// packages/application/src/generation/steps/resolve-variables.step.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts';

import { deriveTemplateVariables } from '../variables/derive-template-variables.js';

export class ResolveVariablesStep implements GenerationPipelineStep {
  readonly name = 'resolve-variable';
  async execute(context: GenerationContext): Promise<void> {
    context.resolvedVariables = deriveTemplateVariables(context.variables);
  }
}
