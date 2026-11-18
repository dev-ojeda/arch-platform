// packages/application/src/generation/composition/create-default-engine.ts

import type {
  FileSystemAsyncPort,
  IdGenerator,
  LanguageConventionRegistry,
  LoggerPort,
  PromptAdapter,
  TemplateRendererPort,
} from '@arch-platform/contracts';

import { createDefaultPipeline } from './create-default-pipeline.js';
import { DefaultGenerationEngine } from '../engine/default-generation-engine.js';
import { PromptEngine } from '../engine/prompt-engine.js';
import { GenerationContextFactory } from '../runtime/generation-context-factory.js';

export interface GenerationEngineFactoryOptions {
  promptAdapter: PromptAdapter;

  filesystem: FileSystemAsyncPort;

  idGenerator: IdGenerator;

  logger: LoggerPort;

  templateRenderer: TemplateRendererPort;

  languageConventionRegistry: LanguageConventionRegistry;
}

export function createGenerationEngine(options: GenerationEngineFactoryOptions) {
  const promptEngine = new PromptEngine(options.promptAdapter);

  const pipeline = createDefaultPipeline({
    promptResolver: promptEngine,
    idGenerator: options.idGenerator,
    templateRenderer: options.templateRenderer,
    languageConventionRegistry: options.languageConventionRegistry,
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
