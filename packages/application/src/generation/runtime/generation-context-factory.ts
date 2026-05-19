// packages/application/src/generation/runtime/generation-context-factory.ts

import type {
  FileSystemPort,
  GenerationContext,
  GenerationRequest,
  LoggerPort,
  NamedVariables,
} from "@arch/contracts";

import { InMemoryGenerationEventBus } from "@arch/core";

export class GenerationContextFactory {
  constructor(
    private readonly fs: FileSystemPort,

    private readonly logger: LoggerPort
  ) {}

  create(request: GenerationRequest): GenerationContext {
    return {
      /*
       * Request
       */

      targetDir: request.targetDir,

      signal: request.signal,

      /*
       * Runtime Services
       */

      logger: request.logger ?? this.logger,

      eventBus: new InMemoryGenerationEventBus(),

      /*
       * Infrastructure
       */

      fs: this.fs,

      /*
       * Generator
       */

      generator: request.generator,

      /*
       * Variables
       */

      variables: (request.variables ?? {}) as NamedVariables,

      /*
       * Runtime Artifacts
       */

      files: [],

      /*
       * Runtime Metadata
       */

      metadata: new Map(),

      /*
       * Runtime Diagnostics
       */

      diagnostics: [],

      /*
       * Runtime Metrics
       */

      metrics: [],
    };
  }
}
