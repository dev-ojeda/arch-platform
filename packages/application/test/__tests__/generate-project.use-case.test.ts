// packages\application\test\__tests__\generate-project.use-case.test.ts

import type { GenerationResult } from '@arch/contracts/generation';
import { createTestGenerator } from '@arch/testing/fixtures';
import { describe, expect, it, vi } from 'vitest';

import type { GenerationEngine } from '../../src/generation/engine/generation-engine.js';
import { InMemoryGeneratorRegistry } from '../../src/generation/registry/in-memory-generator-registry.js';
import { GenerateProjectUseCase } from '../../src/use-cases/generate-project/generate-project.use-case.js';

describe('GenerateProjectUseCase', () => {
  it('delegates generation to engine', async () => {
    const generator = createTestGenerator({
      descriptor: {
        id: 'mvc',
        displayName: 'MVC',
        version: '1.0.0',
        languages: ['typescript'],
        frameworks: ['express'],
      },
    });

    const registry = new InMemoryGeneratorRegistry();

    registry.register(generator);

    const result = {
      files: [],
      diagnostics: [],
    } as unknown as GenerationResult;

    const generate = vi.fn().mockResolvedValue(result);

    const engine: GenerationEngine = {
      generate,
    };

    const useCase = new GenerateProjectUseCase(registry, engine);

    const output = await useCase.execute({
      generator,
      targetDir: '/tmp',
    });

    expect(output).toBe(result);

    expect(generate).toHaveBeenCalled();
  });
});
