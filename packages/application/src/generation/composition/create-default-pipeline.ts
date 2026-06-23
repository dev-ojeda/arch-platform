// packages/application/src/generation/composition/create-default-pipeline.ts

import type {
  GenerationHooks,
  GenerationPipelineStep,
  IdGenerator,
  PromptResolver,
  TemplateRendererPort,
  TemplateVariables,
} from '@arch/contracts';

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

  templateRenderer: TemplateRendererPort;
}

export function createDefaultPipeline<TVariables extends TemplateVariables>(
  dependencies: PipelineDependencies,
): GenerationPipeline<TVariables> {
  const { promptResolver, idGenerator, templateRenderer } = dependencies;

  const hooks = createPipelineHooks<TVariables>();

  const steps = createPipelineSteps<TVariables>(promptResolver, templateRenderer);

  return new GenerationPipeline<TVariables>({
    steps,
    idGenerator,
    hooks,
  });
}

function createPipelineHooks<TVariables extends TemplateVariables>(): GenerationHooks<TVariables> {
  return new CompositeGenerationHooks<TVariables>([
    new LoggingGenerationHooks<TVariables>(),
    new TelemetryGenerationHooks<TVariables>(),
    new EventGenerationHooks<TVariables>(),
  ]);
}
function createPipelineSteps<TVariables extends TemplateVariables>(
  promptResolver: PromptResolver,
  templateRenderer: TemplateRendererPort,
): readonly GenerationPipelineStep<TVariables>[] {
  return [
    new ValidateGeneratorStep<TVariables>(),
    new ResolvePromptsStep<TVariables>(promptResolver),
    new ResolveVariablesStep<TVariables>(),
    new ResolveTemplatesStep<TVariables>(),
    new RenderFilesStep<TVariables>(templateRenderer),
    new WriteFilesStep<TVariables>(),
  ];
}
