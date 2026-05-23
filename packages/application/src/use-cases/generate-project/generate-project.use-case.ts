// packages/application/src/application/use-cases/generate-project/generate-project.use-case.ts

import type { GenerationResult, LoggerPort } from '@arch/contracts';
import { GeneratorNotFoundError, type GeneratorRegistry } from '@arch/core';

import type { GenerationEngine } from '../../generation/engine/generation-engine.js';

export interface GenerateProjectRequest {
  readonly generatorId: string;

  readonly targetDir: string;

  readonly logger?: LoggerPort;

  readonly signal?: AbortSignal;
}

export class GenerateProjectUseCase {
  constructor(
    private readonly registry: GeneratorRegistry,

    private readonly engine: GenerationEngine,
  ) {}

  async execute(request: GenerateProjectRequest): Promise<GenerationResult> {
    const generator = await this.registry.get(request.generatorId);

    if (!generator) {
      throw new GeneratorNotFoundError(request.generatorId);
    }

    return await this.engine.generate({
      generator,

      targetDir: request.targetDir,

      logger: request.logger,

      signal: request.signal,
    });
  }
}
