// packages/application/src/generation/steps/resolve-prompts.step.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
  PromptResolver,
} from "@arch/contracts";

export class ResolvePromptsStep implements GenerationPipelineStep {
  readonly name = "resolve-prompts";

  constructor(private readonly prompts: PromptResolver) {}

  async execute(context: GenerationContext): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new Error("Generator not available");
    }

    const variables = await this.prompts.collect(generator.schema);

    context.variables = {
      ...context.variables,

      ...variables,
    };
  }
}
