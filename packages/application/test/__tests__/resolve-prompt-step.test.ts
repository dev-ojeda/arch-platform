// packages\application\test\__tests__\resolve-prompt-step.test.ts

import { describe, expect, it, vi } from 'vitest';

import { ResolvePromptsStep } from '../../src/generation/steps/resolve-prompts.step.js';
import { testGenerator } from '../fixtures/generators/test-generator.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';
import { createTestPromptResolver } from '../fixtures/prompt/create-test-prompt-resolver.js';

describe('CreateResolvePromptStep', () => {
  it('overrides existing variables with resolved values', async () => {
    const resolver = createTestPromptResolver({
      name: 'arch',
      language: 'ts',
    });

    const step = new ResolvePromptsStep(resolver);

    const context = createTestPipelineContext({
      generator: testGenerator,
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
