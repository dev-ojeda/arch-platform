// packages\application\test\__tests__\validate-generator.step.test.ts
import type { GenerationContext } from '@arch/contracts/generation';
import { describe, expect, it } from 'vitest';

import { GeneratorValidationError } from '../../src/generation/errors/generator-validation-error.js';
import { ValidateGeneratorStep } from '../../src/generation/steps/validate-generator.step.js';

describe('ValidateGeneratorStep', () => {
  it('throws when generator is missing', async () => {
    const step = new ValidateGeneratorStep();

    const context = {} as GenerationContext;

    await expect(step.execute(context)).rejects.toThrow(GeneratorValidationError);
  });
});
