// packages/application/src/generation/composition/create-default-engine.ts

import type {
  FileSystemAsyncPort,
  IdGenerator,
  LoggerPort,
  PromptAdapter,
  TemplateRendererPort,
} from '@arch/contracts';

import { DefaultGenerationEngine } from '../engine/default-generation-engine.js';
import { PromptEngine } from '../engine/prompt-engine.js';
import { GenerationContextFactory } from '../runtime/generation-context-factory.js';

import { createDefaultPipeline } from './create-default-pipeline.js';

export interface GenerationEngineFactoryOptions {
  promptAdapter: PromptAdapter;

  filesystem: FileSystemAsyncPort;

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
