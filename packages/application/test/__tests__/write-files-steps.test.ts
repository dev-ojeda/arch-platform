// packages\application\test\__tests__\write-files-steps.test.ts

import { describe, expect, it, vi } from 'vitest';

import { WriteFilesStep } from '../../src/generation/steps/write-files.step.js';
import { createTestPipelineContext } from '../fixtures/pipeline/create-test-pipeline-context.js';

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

    expect(writeSpy).toHaveBeenCalledWith(
      'services/UserService.ts',
      'export class UserService {}',
      { overwrite: undefined },
    );
  });

  it.each(['skip', 'overwrite', 'error', 'append'] as const)(
    'passes the %s overwrite policy to filesystem',
    async (overwrite) => {
      const context = createTestPipelineContext();

      context.files.push({
        path: 'services/UserService.ts',
        content: 'export class UserService {}',
        overwrite,
      });

      const writeSpy = vi.spyOn(context.fs, 'write');

      const step = new WriteFilesStep();

      await step.execute(context);

      expect(writeSpy).toHaveBeenCalledWith(
        'services/UserService.ts',
        'export class UserService {}',
        { overwrite },
      );
    },
  );

  it('writes generated files sequentially', async () => {
    const context = createTestPipelineContext();

    context.files.push(
      { path: 'first.ts', content: 'first' },
      { path: 'second.ts', content: 'second' },
    );

    const writeSpy = vi.spyOn(context.fs, 'write');

    const step = new WriteFilesStep();

    await step.execute(context);

    expect(writeSpy.mock.invocationCallOrder[0]).toBeLessThan(
      writeSpy.mock.invocationCallOrder[1]!,
    );
  });

  it('propagates filesystem errors', async () => {
    const context = createTestPipelineContext();

    context.files.push({
      path: 'services/UserService.ts',
      content: 'export class UserService {}',
    });

    const error = new Error('Filesystem write failed');

    vi.spyOn(context.fs, 'write').mockRejectedValue(error);

    const step = new WriteFilesStep();

    await expect(step.execute(context)).rejects.toBe(error);
  });
});
