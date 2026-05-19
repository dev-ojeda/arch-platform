// packages/application/src/generation/composition/create-default-engine.ts
import { PromptEngine } from "@arch/contracts";

import { DefaultGenerationEngine } from "../engine/default-generation-engine.js";

import { GenerationContextFactory } from "../runtime/generation-context-factory.js";

import { createDefaultPipeline } from "./create-default-pipeline.js";

import type {
  FileSystemPort,
  LoggerPort,
  PromptAdapter,
} from "@arch/contracts";
import { consoleLogger } from "@arch/core";

export interface GenerationEngineFactoryOptions {
  promptAdapter: PromptAdapter;

  filesystem: FileSystemPort;

  logger?: LoggerPort;
}

export function createGenerationEngine(
  options: GenerationEngineFactoryOptions
) {
  const promptEngine = new PromptEngine(options.promptAdapter);

  const pipeline = createDefaultPipeline({
    promptResolver: promptEngine,
  });

  const contextFactory = new GenerationContextFactory(
    options.filesystem,

    options.logger ?? consoleLogger
  );

  return new DefaultGenerationEngine(
    pipeline,

    contextFactory
  );
}
