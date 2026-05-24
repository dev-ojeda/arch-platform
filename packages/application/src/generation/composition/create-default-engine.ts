// packages/application/src/generation/composition/create-default-engine.ts

import type { FileSystemPort, IdGenerator, LoggerPort, PromptAdapter } from '@arch/contracts';
import { PromptEngine } from '@arch/contracts';
import { ConsoleLogger } from '@arch/core';

import { DefaultGenerationEngine } from '../engine/default-generation-engine.js';
import { GenerationContextFactory } from '../runtime/generation-context-factory.js';

import { createDefaultPipeline } from './create-default-pipeline.js';

export interface GenerationEngineFactoryOptions {
  promptAdapter: PromptAdapter;

  filesystem: FileSystemPort;

  idGenerator: IdGenerator;

  logger?: LoggerPort;
}

export function createGenerationEngine(options: GenerationEngineFactoryOptions) {
  const promptEngine = new PromptEngine(options.promptAdapter);

  const pipeline = createDefaultPipeline({
    promptResolver: promptEngine,

    idGenerator: options.idGenerator,
  });

  const contextFactory = new GenerationContextFactory(
    options.filesystem,

    options.logger ?? new ConsoleLogger(),
  );

  return new DefaultGenerationEngine(
    pipeline,

    contextFactory,
  );
}
