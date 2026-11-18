// packages\application\test\__tests__\generate-project-use-case.test.ts

import { describe, expect, it, vi } from 'vitest';

import type { GenerationResult } from '@arch-platform/contracts';
import { GeneratorRegistry } from '@arch-platform/core';

import type { GenerationEngine } from '../../src/generation/engine/generation-engine.js';
import { GenerateProjectUseCase } from '../../src/use-cases/generate-project/generate-project-use-case.js';
import { createTestGenerator } from '../fixtures/generators/create-test-generator.js';

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

    const registry = new GeneratorRegistry();

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
      generatorId: 'mvc',
      targetDir: '/tmp',
    });

    expect(output).toBe(result);

    expect(generate).toHaveBeenCalled();
  });
});
