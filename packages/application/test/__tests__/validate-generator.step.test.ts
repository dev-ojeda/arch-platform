// packages\application\test\__tests__\validate-generator.step.test.ts

import { describe, expect, it } from 'vitest';

import type { GenerationContext } from '@arch-platform/contracts';

import { ValidateGeneratorStep } from '../../src/generation/steps/validate-generator.step.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';

describe('ValidateGeneratorStep', () => {
  it('throws when generator descriptor is missing', async () => {
    const step = new ValidateGeneratorStep();

    const context = {
      generator: {
        templates: [],
      },
    } as unknown as GenerationContext;

    await expect(step.execute(context)).rejects.toThrow('Generator descriptor missing');
  });

  it('throws when generator templates are missing', async () => {
    const step = new ValidateGeneratorStep();

    const context = {
      generator: {
        descriptor: {
          id: 'test',
          displayName: 'Test Generator',
          version: '1.0.0',
          languages: ['typescript'],
          frameworks: [],
        },
      },
    } as unknown as GenerationContext;

    await expect(step.execute(context)).rejects.toThrow('Generator templates missing');
  });

  it('completes when generator is valid', async () => {
    const step = new ValidateGeneratorStep();
    const context = createTestPipelineContext();

    await expect(step.execute(context)).resolves.toBeUndefined();
  });
});
