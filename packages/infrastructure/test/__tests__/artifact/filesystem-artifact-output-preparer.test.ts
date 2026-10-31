// packages/infrastructure/test/__tests__/artifact/filesystem-artifact-output-preparer.test.ts

import { describe, expect, it } from 'vitest';

import { createFilesystem } from '../../helpers/create-filesystem-fixture.js';
import { createPreparer } from '../../helpers/create-filesystem-preparer-fixture.js';

describe('FilesystemArtifactOutputPreparer', () => {
  const root = '/workspace';

  it('removes each declared output resolved against the package root', async () => {
    const filesystem = createFilesystem();
    const preparer = createPreparer(filesystem);

    await preparer.prepare(root, ['dist', 'coverage/report.json']);

    expect(filesystem.remove).toHaveBeenCalledTimes(2);
    expect(filesystem.remove).toHaveBeenNthCalledWith(1, '/workspace/dist');
    expect(filesystem.remove).toHaveBeenNthCalledWith(2, '/workspace/coverage/report.json');
  });

  it('does nothing when there are no declared outputs', async () => {
    const filesystem = createFilesystem();
    const preparer = createPreparer(filesystem);

    await preparer.prepare(root, []);

    expect(filesystem.remove).not.toHaveBeenCalled();
  });

  it.each([
    ['/outside/dist', 'absolute POSIX path'],
    ['C:\\outside\\dist', 'absolute Windows path'],
    ['\\\\server\\share\\dist', 'UNC path'],
    ['../outside', 'parent traversal'],
    ['dist/../outside', 'nested parent traversal'],
    ['', 'empty path'],
    ['   ', 'whitespace-only path'],
    ['.', 'package root itself'],
  ])('rejects %s (%s) without deleting anything', async (output) => {
    const filesystem = createFilesystem();
    const preparer = createPreparer(filesystem);

    await expect(preparer.prepare(root, [output])).rejects.toThrow();

    expect(filesystem.remove).not.toHaveBeenCalled();
  });

  it('validates every output before deleting any of them', async () => {
    const filesystem = createFilesystem();
    const preparer = createPreparer(filesystem);

    await expect(preparer.prepare(root, ['dist', '../outside'])).rejects.toThrow();

    expect(filesystem.remove).not.toHaveBeenCalled();
  });

  it('propagates filesystem errors', async () => {
    const filesystem = createFilesystem();
    filesystem.remove.mockRejectedValueOnce(new Error('Filesystem removal failed'));

    const preparer = createPreparer(filesystem);

    await expect(preparer.prepare(root, ['dist'])).rejects.toThrow('Filesystem removal failed');
  });
});
