import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { TemplateVariables } from '@arch/contracts/variables';

import { GeneratorValidationError } from '../errors/generator-validation-error.js';

export class ValidateGeneratorStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'validate-generator';

  async execute(context: GenerationContext<TVariables>): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new GeneratorValidationError('Generator not loaded');
    }

    if (!generator.descriptor) {
      throw new GeneratorValidationError('Generator descriptor missing');
    }

    if (!generator.templates) {
      throw new GeneratorValidationError('Generator templates missing');
    }
    return Promise.resolve();
  }
}
