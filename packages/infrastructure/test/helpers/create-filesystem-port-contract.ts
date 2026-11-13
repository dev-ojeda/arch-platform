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
