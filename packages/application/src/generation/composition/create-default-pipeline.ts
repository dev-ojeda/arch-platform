// packages/application/src/generation/composition/create-default-pipeline.ts

import type { IdGenerator, PromptResolver } from '@arch/contracts';

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

  idGenerator: IdGenerator;
}

export function createDefaultPipeline(dependencies: PipelineDependencies): GenerationPipeline {
  const { promptResolver, idGenerator } = dependencies;

  const hooks = createPipelineHooks();

  const steps = createPipelineSteps(promptResolver);

  return new GenerationPipeline(steps, idGenerator, hooks);
}

function createPipelineHooks() {
  return new CompositeGenerationHooks([
    new LoggingGenerationHooks(),

    new TelemetryGenerationHooks(),

    new EventGenerationHooks(),
  ]);
}

function createPipelineSteps(promptResolver: PromptResolver) {
  return [
    new ValidateGeneratorStep(),

    new ResolvePromptsStep(promptResolver),

    new ResolveVariablesStep(),

    new ResolveTemplatesStep(),

    new RenderFilesStep(),

    new WriteFilesStep(),
  ];
}
