// packages/application/src/generation/steps/resolve-prompts.step.ts

import type { GenerationContext, GenerationPipelineStep } from '@arch/contracts/generation';
import type { PromptResolver } from '@arch/contracts/prompts';
import type { TemplateVariables } from '@arch/contracts/variables';

export class ResolvePromptsStep<
  TVariables extends TemplateVariables = TemplateVariables,
> implements GenerationPipelineStep<TVariables> {
  readonly name = 'resolve-prompts';

  constructor(private readonly prompts: PromptResolver) {}

  async execute(context: GenerationContext<TVariables>): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new Error('Generator not available');
    }

    const variables = await this.prompts.collect(generator.schema);

    context.variables = {
      ...context.variables,
      ...variables,
    };
  }
}
