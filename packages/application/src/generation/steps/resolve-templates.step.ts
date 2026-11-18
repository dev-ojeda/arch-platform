// packages/application/src/generation/steps/resolve-templates.step.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
  TemplateVariables,
} from '@arch-platform/contracts';

import { GeneratorValidationError } from '../errors/generator-validation-error.js';
import { resolveTemplateDefinition } from '../templates/resolve-template-definition.js';

export class ResolveTemplatesStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'resolve-template';

  async execute(context: GenerationContext<TVariables>): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new GeneratorValidationError('Generator not loaded');
    }

    context.resolvedTemplates = generator.templates.map((template) =>
      resolveTemplateDefinition(template),
    );

    return Promise.resolve();
  }
}
