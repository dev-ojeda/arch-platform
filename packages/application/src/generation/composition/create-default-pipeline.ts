// packages/application/src/generation/composition/create-default-pipeline.ts

import type { PromptResolver } from '@arch/contracts';

import { CompositeGenerationHooks } from '../hooks/composite-generation-hooks.js';
import { EventGenerationHooks } from '../hooks/event-generation-hooks.js';
import { LoggingGenerationHooks } from '../hooks/logging-generation-hooks.js';
import { TelemetryGenerationHooks } from '../hooks/telemetry-generation-hooks.js';
import { GenerationPipeline } from '../pipeline/generation-pipeline.js';
import { RenderFilesStep } from '../steps/render-files.step.js';
import { ResolvePromptsStep } from '../steps/resolve-prompts.step.js';
import { ResolveTemplatesStep } from '../steps/resolve-templates.step.js';
import { ResolveVariablesStep } from '../steps/resolve-variables.step.js';
import { ValidateGeneratorStep } from '../steps/validate-generator.step.js';
import { WriteFilesStep } from '../steps/write-files.step.js';


export interface PipelineDependencies {
  promptResolver: PromptResolver;
}

export function createDefaultPipeline(dependencies: PipelineDependencies): GenerationPipeline {
  const hooks = new CompositeGenerationHooks([
    new LoggingGenerationHooks(),

    new TelemetryGenerationHooks(),

    new EventGenerationHooks(),
  ]);

  return new GenerationPipeline(
    [
      new ValidateGeneratorStep(),

      new ResolvePromptsStep(dependencies.promptResolver),

      new ResolveVariablesStep(),

      new ResolveTemplatesStep(),

      new RenderFilesStep(),

      new WriteFilesStep(),
    ],

    hooks,
  );
}
