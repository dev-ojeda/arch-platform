// packages/application/src/generation/composition/create-default-engine.ts

import { PromptEngine } from "@arch/contracts";

import { DefaultGenerationEngine } from "../engine/default-generation-engine.js";

import { GenerationContextFactory } from "../runtime/generation-context-factory.js";

import { createDefaultPipeline } from "./create-default-pipeline.js";

import type { FileSystemPort, PromptAdapter } from "@arch/contracts";

export interface GenerationEngineFactoryOptions {
  promptAdapter: PromptAdapter;

  filesystem: FileSystemPort;
}

export function createGenerationEngine(
  options: GenerationEngineFactoryOptions
) {
  const promptEngine = new PromptEngine(options.promptAdapter);

  const pipeline = createDefaultPipeline({
    promptResolver: promptEngine,
  });

  const contextFactory = new GenerationContextFactory(options.filesystem);

  return new DefaultGenerationEngine(
    pipeline,

    contextFactory
  );
}
