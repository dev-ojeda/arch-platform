// packages/testing/src/contracts/filesystem-port.contract.ts

import type { FileSystemPort } from '@arch/contracts/filesystem';
import { beforeEach, describe, expect, it } from 'vitest';

export interface FilesystemPortContractOptions {
  createFilesystem(): FileSystemPort;
}

export function describeFilesystemPortContract(options: FilesystemPortContractOptions): void {
  describe('FileSystemPort contract', () => {
    let filesystem: FileSystemPort;

    beforeEach(() => {
      filesystem = options.createFilesystem();
    });

    describe('file operations', () => {
      it('writes and reads files', async () => {
        await filesystem.write('/src/index.ts', 'export {};');

        await expect(filesystem.read('/src/index.ts')).resolves.toBe('export {};');
      });

      it('copies files', async () => {
        await filesystem.write('/src/source.ts', 'source');

        await filesystem.copy('/src/source.ts', '/src/copy.ts');

        await expect(filesystem.read('/src/copy.ts')).resolves.toBe('source');
      });

      it('throws when reading missing files', async () => {
        await expect(filesystem.read('/missing.txt')).rejects.toThrow(
          'File not found: /missing.txt',
        );
      });

      it('throws when copying missing files', async () => {
        await expect(filesystem.copy('/missing.txt', '/copy.txt')).rejects.toThrow(
          'File not found: /missing.txt',
        );
      });

      it('removes files', async () => {
        await filesystem.write('/src/index.ts', 'content');

        await filesystem.remove('/src/index.ts');

        await expect(filesystem.exists('/src/index.ts')).resolves.toBe(false);
      });
    });

    describe('directory operations', () => {
      it('creates directories', async () => {
        await filesystem.createDirectory('/src/components');

        await expect(filesystem.exists('/src/components')).resolves.toBe(true);
      });

      it('removes directories recursively', async () => {
        await filesystem.write('/src/components/button.ts', 'button');

        await filesystem.remove('/src');

        await expect(filesystem.exists('/src/components/button.ts')).resolves.toBe(false);
      });

      it('reads directory entries', async () => {
        await filesystem.createDirectory('/src/components');

        await filesystem.write('/src/index.ts', 'index');

        await filesystem.write('/src/main.ts', 'main');

        const entries = await filesystem.readDirectory('/src');

        expect(entries).toHaveLength(3);

        expect(entries).toContainEqual({
          name: 'components',
          path: '/src/components',
          isDirectory: true,
        });

        expect(entries).toContainEqual({
          name: 'index.ts',
          path: '/src/index.ts',
          isDirectory: false,
        });

        expect(entries).toContainEqual({
          name: 'main.ts',
          path: '/src/main.ts',
          isDirectory: false,
        });
      });
    });

    describe('path handling', () => {
      it('returns false for missing paths', async () => {
        await expect(filesystem.exists('/missing')).resolves.toBe(false);
      });

      it('normalizes paths consistently', async () => {
        await filesystem.write('\\src\\index.ts', 'normalized');

        await expect(filesystem.read('/src/index.ts')).resolves.toBe('normalized');
      });

      it('creates parent directories automatically when writing files', async () => {
        await filesystem.write('/src/components/button.ts', 'button');

        await expect(filesystem.exists('/src/components')).resolves.toBe(true);
      });

      it('creates parent directories recursively', async () => {
        await filesystem.write('/src/a/b/c/file.ts', 'content');

        await expect(filesystem.exists('/src')).resolves.toBe(true);
        await expect(filesystem.exists('/src/a')).resolves.toBe(true);
        await expect(filesystem.exists('/src/a/b')).resolves.toBe(true);
        await expect(filesystem.exists('/src/a/b/c')).resolves.toBe(true);
      });
    });

    describe('filesystem integrity', () => {
      it('prevents writing files over directories', async () => {
        await filesystem.createDirectory('/src');

        await expect(filesystem.write('/src', 'invalid')).rejects.toThrow(
          'Cannot write file over directory: /src',
        );
      });

      it('prevents creating directories over files', async () => {
        await filesystem.write('/src/index.ts', 'content');

        await expect(filesystem.createDirectory('/src/index.ts')).rejects.toThrow(
          'Cannot create directory over file: /src/index.ts',
        );
      });
    });
  });
}
