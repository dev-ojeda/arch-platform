// packages/application/src/generation/runtime/generation-context-factory.ts

import type {
  FileSystemPort,
  GenerationContext,
  GenerationRequest,
  NamedVariables,
} from "@arch/contracts";

import { consoleLogger, InMemoryGenerationEventBus } from "@arch/core";

export class GenerationContextFactory {
  constructor(private readonly defaultFs: FileSystemPort) {}

  create(request: GenerationRequest): GenerationContext {
    return {
      targetDir: request.targetDir,

      fs: request.fs ?? this.defaultFs,

      logger: request.logger ?? consoleLogger,

      signal: request.signal,

      variables: {} as NamedVariables,

      files: [],

      metadata: new Map(),

      diagnostics: [],

      metrics: [],

      eventBus: new InMemoryGenerationEventBus(),
    };
  }
}
