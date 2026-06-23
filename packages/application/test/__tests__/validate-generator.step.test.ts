// packages\application\test\__tests__\validate-generator.step.test.ts
import type { GenerationContext } from '@arch/contracts';
import { describe, expect, it } from 'vitest';

import { ValidateGeneratorStep } from '../../src/generation/steps/validate-generator.step.js';

describe('ValidateGeneratorStep', () => {
  it('throws when generator is missing', async () => {
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
          name: 'test',
          version: '1.0.0',
        },
      },
    } as unknown as GenerationContext;

    await expect(step.execute(context)).rejects.toThrow('Generator templates missing');
  });
  it('completes when generator is valid', async () => {
    const step = new ValidateGeneratorStep();

    const context = {
      generator: {
        descriptor: {
          name: 'test',
          version: '1.0.0',
        },
        templates: [],
      },
    } as unknown as GenerationContext;

    await expect(step.execute(context)).resolves.toBeUndefined();
  });
});
