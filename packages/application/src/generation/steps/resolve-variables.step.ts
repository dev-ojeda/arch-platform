// packages/application/src/generation/steps/resolve-variables.step.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
  LanguageConventionRegistry,
  TemplateVariables,
} from '@arch-platform/contracts';

import { buildVariables } from '../variables/derive-template-variables.js';

export class ResolveVariablesStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'resolve-variables';

  constructor(private readonly languageConventionRegistry: LanguageConventionRegistry) {}

  execute(context: GenerationContext<TVariables>): Promise<void> {
    const convention = this.languageConventionRegistry.get(context.languageId);

    context.resolvedVariables = buildVariables(context.variables, convention);

    return Promise.resolve();
  }
}
