// packages/application/src/generation/runtime/generation-context-factory.ts

import type { FileSystemPort } from '@arch/contracts/filesystem';
import type { GenerationContext, GenerationRequest } from '@arch/contracts/generation';
import type { LoggerPort } from '@arch/contracts/logging';
import type { TemplateVariables } from '@arch/contracts/variables';
import { InMemoryGenerationEventBus } from '@arch/core/events';

export class GenerationContextFactory {
  constructor(
    private readonly fs: FileSystemPort,
    private readonly logger: LoggerPort,
  ) {}

  create<TVariables extends TemplateVariables>(
    request: GenerationRequest<TVariables>,
  ): GenerationContext<TVariables> {
    return {
      targetDir: request.targetDir,
      signal: request.signal,

      logger: request.logger ?? this.logger,
      eventBus: new InMemoryGenerationEventBus(),

      fs: this.fs,

      generator: request.generator,

      variables: (request.variables ?? {}) as TVariables,

      files: [],
      metadata: new Map(),
      diagnostics: [],
      metrics: [],
    };
  }
}
