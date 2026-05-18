// packages/application/src/generation/composition/create-default-pipeline.ts

import type { PromptResolver } from "@arch/contracts";

import { ValidateGeneratorStep } from "../steps/validate-generator.step.js";

import { ResolvePromptsStep } from "../steps/resolve-prompts.step.js";

import { ResolveVariablesStep } from "../steps/resolve-variables.step.js";

import { ResolveTemplatesStep } from "../steps/resolve-templates.step.js";

import { RenderFilesStep } from "../steps/render-files.step.js";

import { GenerationPipeline } from "../engine/pipeline/generation-pipeline.js";
import { WriteFilesStep } from "../steps/write-files.step.js";

export interface PipelineDependencies {
  promptResolver: PromptResolver;
}

export function createDefaultPipeline(
  dependencies: PipelineDependencies
): GenerationPipeline {
  return new GenerationPipeline([
    new ValidateGeneratorStep(),

    new ResolvePromptsStep(dependencies.promptResolver),

    new ResolveVariablesStep(),

    new ResolveTemplatesStep(),

    new RenderFilesStep(),

    new WriteFilesStep(),
  ]);
}
