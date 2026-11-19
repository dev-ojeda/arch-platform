// packages\application\src\use-cases\generate-project\generate-project-use-case.ts

import type {
  FileSystemAsyncPort,
  GenerationResult,
  GeneratorRegistry,
  LoggerPort,
  NamedVariables,
} from '@arch-platform/contracts';

import type { GenerationEngine } from '../../generation/engine/generation-engine.js';

export interface GenerateProjectInput<TVariables extends NamedVariables = NamedVariables> {
  generatorId: string;
  targetDir: string;
  variables?: Partial<TVariables>;
  fs?: FileSystemAsyncPort;
  logger?: LoggerPort;
  signal?: AbortSignal;
}

export class GenerateProjectUseCase {
  constructor(
    private readonly registry: GeneratorRegistry,
    private readonly engine: GenerationEngine,
  ) {}

  async execute(input: GenerateProjectInput): Promise<GenerationResult> {
    const generator = this.registry.get(input.generatorId);

    if (!generator) {
      throw new Error(`Generator not found: ${input.generatorId}`);
    }

    return this.engine.generate({
      generator,
      languageId: input.generatorId,
      targetDir: input.targetDir,
      variables: input.variables,
      fs: input.fs,
      logger: input.logger,
      signal: input.signal,
    });
  }
}
