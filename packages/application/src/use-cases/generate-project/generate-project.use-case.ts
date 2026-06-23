// packages\application\src\use-cases\generate-project\generate-project.use-case.ts

import type { GenerationRequest, GenerationResult, GeneratorRegistry } from '@arch/contracts';

import type { GenerationEngine } from '../../generation/engine/generation-engine.js';

export class GenerateProjectUseCase {
  constructor(
    private readonly registry: GeneratorRegistry,
    private readonly engine: GenerationEngine,
  ) {}

  async execute(request: GenerationRequest): Promise<GenerationResult> {
    const generator = await this.registry.get(request.generator.descriptor.id);

    return await this.engine.generate({
      generator,
      targetDir: request.targetDir,
      logger: request.logger,
      signal: request.signal,
    });
  }
}
