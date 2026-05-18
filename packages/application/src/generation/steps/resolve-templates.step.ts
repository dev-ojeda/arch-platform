// packages/application/src/generation/steps/resolve-templates.step.ts

import type {
  GenerationContext,
  GenerationPipelineStep,
} from "@arch/contracts";

import { GeneratorValidationError } from "../errors/generator-validation-error.js";

import { resolveTemplateDefinition } from "../templates/resolve-template-definition.js";

export class ResolveTemplatesStep implements GenerationPipelineStep {
  readonly name = "resolve-template";

  async execute(context: GenerationContext): Promise<void> {
    const generator = context.generator;

    if (!generator) {
      throw new GeneratorValidationError("Generator not loaded");
    }

    const variables = context.resolvedVariables;

    if (!variables) {
      throw new GeneratorValidationError("Resolved variables not available");
    }

    const resolved = generator.templates.map((template) =>
      resolveTemplateDefinition(
        template,

        variables
      )
    );

    context.resolvedTemplates = resolved;
  }
}
