// packages/application/src/generation/composition/create-default-engine.ts

import type { FileSystemPort } from '@arch/contracts/filesystem';
import type { LoggerPort } from '@arch/contracts/logging';
import type { PromptAdapter } from '@arch/contracts/prompts';
import { PromptEngine } from '@arch/contracts/prompts';
import type { TemplateRendererPort } from '@arch/contracts/renderer';
import type { IdGenerator } from '@arch/contracts/runtime';

import { DefaultGenerationEngine } from '../engine/default-generation-engine.js';
import { GenerationContextFactory } from '../runtime/generation-context-factory.js';

import { createDefaultPipeline } from './create-default-pipeline.js';

export interface GenerationEngineFactoryOptions {
  promptAdapter: PromptAdapter;

  filesystem: FileSystemPort;

  idGenerator: IdGenerator;

  logger: LoggerPort;

  templateRenderer: TemplateRendererPort;
}

export function createGenerationEngine(options: GenerationEngineFactoryOptions) {
  const promptEngine = new PromptEngine(options.promptAdapter);

  const pipeline = createDefaultPipeline({
    promptResolver: promptEngine,

    idGenerator: options.idGenerator,

    templateRenderer: options.templateRenderer,
  });

  const contextFactory = new GenerationContextFactory(
    options.filesystem,

    options.logger,
  );

  return new DefaultGenerationEngine(
    pipeline,

    contextFactory,
  );
}
