// packages\application\test\__tests__\resolve-prompt-step.test.ts

import { createTestGenerator } from '@arch/testing/fixtures';
import { createTestPipelineContext } from '@arch/testing/pipeline';
import { createTestPromptResolver } from '@arch/testing/prompts';
import { describe, expect, it, vi } from 'vitest';

import { ResolvePromptsStep } from '../../src/generation/steps/resolve-prompts.step.js';

describe('CreateResolvePromptStep', () => {
  it('overrides existing variables with resolved values', async () => {
    const resolver = createTestPromptResolver({
      name: 'arch',
      language: 'ts',
    });

    const step = new ResolvePromptsStep(resolver);

    const context = createTestPipelineContext({
      generator: createTestGenerator(),
    });

    await step.execute(context);

    expect(context.variables).toEqual({
      name: 'arch',
      language: 'ts',
    });
  });
  it('throws when generator is not available', async () => {
    const resolver = createTestPromptResolver();

    const collectSpy = vi.spyOn(resolver, 'collect');

    const step = new ResolvePromptsStep(resolver);

    const context = createTestPipelineContext();

    context.generator = undefined;

    await expect(step.execute(context)).rejects.toThrow('Generator not available');

    expect(collectSpy).not.toHaveBeenCalled();
  });
});
