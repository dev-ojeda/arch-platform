// packages\application\test\__tests__\write-files-steps.test.ts

import { describe, expect, it, vi } from 'vitest';

import { createTestPipelineContext } from '@arch/testing';

import { WriteFilesStep } from '../../src/generation/steps/write-files.step.js';

describe('WriteFilesStep', () => {
  it('writes generated files to filesystem', async () => {
    const context = createTestPipelineContext();

    context.files.push({
      path: 'services/UserService.ts',
      content: 'export class UserService {}',
    });

    const writeSpy = vi.spyOn(context.fs, 'write');

    const step = new WriteFilesStep();

    await step.execute(context);

    expect(writeSpy).toHaveBeenCalledWith('services/UserService.ts', 'export class UserService {}');
  });
});
