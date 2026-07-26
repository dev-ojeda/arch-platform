// packages\application\test\__tests__\create-mock-filesystem.test.ts

import { beforeEach, describe, expect, it } from 'vitest';

import { createMockFilesystem } from '@arch/testing';

describe('createMockFilesystem', () => {
  let filesystem: ReturnType<typeof createMockFilesystem>;

  beforeEach(() => {
    filesystem = createMockFilesystem();
  });

  it('writes and reads files', async () => {
    await filesystem.write(
      'src/example.ts',

      'export const value = 1;',
    );

    await expect(filesystem.read('src/example.ts')).resolves.toBe('export const value = 1;');
  });

  it('checks file existence', async () => {
    await filesystem.write(
      'README.md',

      '# test',
    );

    await expect(filesystem.exists('README.md')).resolves.toBe(true);

    await expect(filesystem.exists('missing.md')).resolves.toBe(false);
  });

  it('copies files', async () => {
    await filesystem.write(
      'source.txt',

      'hello world',
    );

    await filesystem.copy(
      'source.txt',

      'target.txt',
    );

    await expect(filesystem.read('target.txt')).resolves.toBe('hello world');
  });

  it('creates directories', async () => {
    await filesystem.createDirectory('src/services');

    await expect(filesystem.exists('src/services')).resolves.toBe(true);
  });

  it('removes files', async () => {
    await filesystem.write(
      'temp.txt',

      'temporary file',
    );

    await filesystem.remove('temp.txt');

    await expect(filesystem.exists('temp.txt')).resolves.toBe(false);
  });

  it('reads directory entries', async () => {
    await filesystem.write('src/a.ts', 'a');

    await filesystem.write('src/b.ts', 'b');

    const entries = await filesystem.readDirectory('src');

    expect(entries).toHaveLength(2);

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          path: '/src/a.ts',
        }),

        expect.objectContaining({
          path: '/src/b.ts',
        }),
      ]),
    );
  });
});
