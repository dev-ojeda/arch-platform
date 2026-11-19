// packages/infrastructure/test/helpers/create-filesystem-port-contract.ts

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import type { FileSystemAsyncPort, FileSystemSyncPort } from '@arch-platform/contracts';

type AnyFileSystemPort = FileSystemAsyncPort | FileSystemSyncPort;

export interface FileSystemContractHarness {
  name: string;
  create: () => Promise<AnyFileSystemPort> | AnyFileSystemPort;
  cleanup: () => Promise<void> | void;
}

export function defineFileSystemPortContract(harness: FileSystemContractHarness): void {
  describe(`${harness.name} (Port Contract)`, () => {
    let fs: AnyFileSystemPort;

    beforeEach(async () => {
      fs = await harness.create();
    });

    afterEach(async () => {
      await harness.cleanup();
    });

    describe('file operations', () => {
      it('writes and reads files', async () => {
        await fs.write('/src/source.ts', 'content');

        expect(await fs.read('/src/source.ts')).toBe('content');
      });

      it('writes and reads binary buffers', async () => {
        const content = 'binary';
        const expected = new TextEncoder().encode(content);

        await fs.write('/assets/data.bin', content);

        const read = await fs.readBuffer('/assets/data.bin');

        expect(read).toBeInstanceOf(Uint8Array);
        expect(Array.from(read)).toEqual(Array.from(expected));
      });
      it('appends content to an existing file', async () => {
        await fs.write('/src/source.ts', 'initial');
        await fs.write('/src/source.ts', ' appended', {
          overwrite: 'append',
        });

        expect(await fs.read('/src/source.ts')).toBe('initial appended');
      });

      it('creates a file when appending to a non-existing file', async () => {
        await fs.write('/src/new.ts', 'initial', {
          overwrite: 'append',
        });

        expect(await fs.read('/src/new.ts')).toBe('initial');
      });

      it('appends content without inserting an implicit line break', async () => {
        await fs.write('/src/source.ts', 'line 1');
        await fs.write('/src/source.ts', 'line 2', {
          overwrite: 'append',
        });

        expect(await fs.read('/src/source.ts')).toBe('line 1line 2');
      });

      it('renames files', async () => {
        await fs.write('/src/source.ts', 'export {};');
        await fs.rename('/src/source.ts', '/src/renamed.ts');

        expect(await fs.exists('/src/source.ts')).toBe(false);
        expect(await fs.exists('/src/renamed.ts')).toBe(true);
        expect(await fs.read('/src/renamed.ts')).toBe('export {};');
      });

      it('copies files', async () => {
        await fs.write('/src/source.ts', 'content');
        await fs.copy('/src/source.ts', '/src/copy.ts');

        expect(await fs.read('/src/copy.ts')).toBe('content');
      });

      it('throws mapped errors when reading, copying or renaming missing files', async () => {
        await expect(async () => fs.read('/missing.txt')).rejects.toThrow();
        await expect(async () => fs.copy('/missing.txt', '/copy.txt')).rejects.toThrow();
        await expect(async () => fs.rename('/missing.txt', '/renamed.txt')).rejects.toThrow();
      });

      it('removes files', async () => {
        await fs.write('/src/source.ts', 'content');
        await fs.remove('/src/source.ts');

        expect(await fs.exists('/src/source.ts')).toBe(false);
      });
    });

    describe('directory operations', () => {
      it('creates directories', async () => {
        await fs.createDirectory('/src/domain');

        expect(await fs.exists('/src/domain')).toBe(true);
      });

      it('removes directories recursively', async () => {
        await fs.write('/src/domain/file.ts', 'content');
        await fs.remove('/src');

        expect(await fs.exists('/src')).toBe(false);
      });

      it('reads directory entries with normalized virtual POSIX paths', async () => {
        await fs.createDirectory('/src/components');
        await fs.write('/src/index.ts', 'index');

        const entries = await fs.readDirectory('/src');

        expect(entries).toHaveLength(2);
        expect(entries).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'components',
              path: '/src/components',
              isDirectory: true,
              isFile: false,
            }),
            expect.objectContaining({
              name: 'index.ts',
              path: '/src/index.ts',
              isDirectory: false,
              isFile: true,
            }),
          ]),
        );
      });

      it('creates a unique temporary directory with default prefix in root', async () => {
        const tempDir1 = await fs.createTempDirectory();
        const tempDir2 = await fs.createTempDirectory();

        expect(tempDir1).toMatch(/^\/tmp-[^/]+$/);
        expect(tempDir2).toMatch(/^\/tmp-[^/]+$/);
        expect(tempDir1).not.toBe(tempDir2);
        expect(await fs.exists(tempDir1)).toBe(true);
        expect(await fs.exists(tempDir2)).toBe(true);
      });

      it('creates a temporary directory inside a nested folder with custom prefix', async () => {
        const tempDir = await fs.createTempDirectory('/builds/session-');

        expect(tempDir).toMatch(/^\/builds\/session-[^/]+$/);
        expect(await fs.exists(tempDir)).toBe(true);

        await fs.write(`${tempDir}/output.txt`, 'build artifact');
        expect(await fs.read(`${tempDir}/output.txt`)).toBe('build artifact');
      });

      it('creates a temporary directory inside a folder when prefix ends with a slash', async () => {
        const tempDirForward = await fs.createTempDirectory('workspace/');
        const tempDirBackward = await fs.createTempDirectory('workspace\\');

        expect(tempDirForward).toMatch(/^\/workspace\/tmp-[^/]+$/);
        expect(tempDirBackward).toMatch(/^\/workspace\/tmp-[^/]+$/);
        expect(await fs.exists(tempDirForward)).toBe(true);
        expect(await fs.exists(tempDirBackward)).toBe(true);
      });

      it('throws when creating a temporary directory inside a path occupied by a file', async () => {
        await fs.write('/blocking-file.txt', 'content');

        await expect(async () =>
          fs.createTempDirectory('/blocking-file.txt/session-'),
        ).rejects.toThrow();
      });

      it('blocks path traversal attempts in createTempDirectory', async () => {
        await expect(async () => fs.createTempDirectory('/../../outside-')).rejects.toThrow(
          /Path outside filesystem root/,
        );
        await expect(async () => fs.createTempDirectory('..\\..\\outside\\')).rejects.toThrow(
          /Path outside filesystem root/,
        );
      });
    });

    describe('cross-platform path handling & security', () => {
      it('returns false for missing paths', async () => {
        expect(await fs.exists('/missing')).toBe(false);
      });

      it('normalizes Windows backslashes and relative paths consistently', async () => {
        await fs.write('\\src\\nested\\index.ts', 'normalized');

        expect(await fs.read('/src/nested/index.ts')).toBe('normalized');
        expect(await fs.read('src/nested/index.ts')).toBe('normalized');
      });

      it('creates parent directories recursively when writing files', async () => {
        await fs.write('/a/b/c/file.txt', 'content');

        expect(await fs.exists('/a/b/c/file.txt')).toBe(true);
      });

      it('blocks path traversal attempts outside root', async () => {
        await expect(async () => fs.read('/../../outside.txt')).rejects.toThrow(
          /Path outside filesystem root/,
        );
        await expect(async () => fs.write('..\\..\\outside.txt', 'hack')).rejects.toThrow(
          /Path outside filesystem root/,
        );
      });
    });

    describe('json operations', () => {
      it('writes and reads json omitting undefined properties', async () => {
        await fs.writeJson('/config.json', {
          name: 'arch-platform',
          version: 1,
          optional: undefined,
        });

        expect(await fs.readJson('/config.json')).toEqual({
          name: 'arch-platform',
          version: 1,
        });
      });
    });
  });
}
