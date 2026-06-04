// packages/application/src/generation/steps/resolve-variables.step.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

import { deriveTemplateVariables } from '../variables/derive-template-variables.js';

export class ResolveVariablesStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'resolve-variable';

  execute(context: GenerationContext<TVariables>): Promise<void> {
    context.resolvedVariables = deriveTemplateVariables(context.variables);
    return Promise.resolve();
  }
}
