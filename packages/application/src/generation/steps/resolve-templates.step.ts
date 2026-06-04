// packages/application/src/generation/steps/resolve-templates.step.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

import { GeneratorValidationError } from '../errors/generator-validation-error.js';
import { resolveTemplateDefinition } from '../templates/resolve-template-definition.js';

export class ResolveTemplatesStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'resolve-template';

  execute(context: GenerationContext<TVariables>): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new GeneratorValidationError('Generator not loaded');
    }

    const variables = context.resolvedVariables;

    if (!variables) {
      throw new GeneratorValidationError('Resolved variables not available');
    }

    context.resolvedTemplates = generator.templates.map((template) =>
      resolveTemplateDefinition(template, variables),
    );

    return Promise.resolve();
  }
}
