// packages/application/test/contracts/filesystem-port.contract.test.ts

import type { FileSystemPort } from '@arch/contracts/filesystem';
import { describe, expect, it } from 'vitest';

export interface FilesystemContractSuiteOptions {
  createFilesystem(): FileSystemPort;
}

export function describeFilesystemPortContract(options: FilesystemContractSuiteOptions): void {
  describe('FileSystemPort contract', () => {
    it('writes and reads files', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('/src/index.ts', 'export {};');

      const content = await filesystem.read('/src/index.ts');

      expect(content).toBe('export {};');
    });

    it('copies files', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('/src/source.ts', 'source');

      await filesystem.copy('/src/source.ts', '/src/copy.ts');

      const content = await filesystem.read('/src/copy.ts');

      expect(content).toBe('source');
    });

    it('creates directories', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.createDirectory('/src/components');

      const exists = await filesystem.exists('/src/components');

      expect(exists).toBe(true);
    });

    it('returns false for missing paths', async () => {
      const filesystem = options.createFilesystem();

      const exists = await filesystem.exists('/missing');

      expect(exists).toBe(false);
    });

    it('removes files', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('/src/index.ts', 'content');

      await filesystem.remove('/src/index.ts');

      const exists = await filesystem.exists('/src/index.ts');

      expect(exists).toBe(false);
    });

    it('removes directories recursively', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('/src/components/button.ts', 'button');

      await filesystem.remove('/src');

      const exists = await filesystem.exists('/src/components/button.ts');

      expect(exists).toBe(false);
    });

    it('reads directory entries', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.createDirectory('/src/components');

      await filesystem.write('/src/index.ts', 'index');

      await filesystem.write('/src/main.ts', 'main');

      const entries = await filesystem.readDirectory('/src');

      expect(entries).toEqual([
        {
          name: 'components',

          path: '/src/components',

          isDirectory: true,
        },
        {
          name: 'index.ts',

          path: '/src/index.ts',

          isDirectory: false,
        },
        {
          name: 'main.ts',

          path: '/src/main.ts',

          isDirectory: false,
        },
      ]);
    });

    it('throws when reading missing files', async () => {
      const filesystem = options.createFilesystem();

      await expect(filesystem.read('/missing.txt')).rejects.toThrow('File not found: /missing.txt');
    });

    it('throws when copying missing files', async () => {
      const filesystem = options.createFilesystem();

      await expect(filesystem.copy('/missing.txt', '/copy.txt')).rejects.toThrow(
        'File not found: /missing.txt',
      );
    });

    it('creates parent directories automatically when writing files', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('/src/components/button.ts', 'button');

      const exists = await filesystem.exists('/src/components');

      expect(exists).toBe(true);
    });

    it('normalizes paths consistently', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('\\src\\index.ts', 'normalized');

      const content = await filesystem.read('/src/index.ts');

      expect(content).toBe('normalized');
    });

    it('prevents writing files over directories', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.createDirectory('/src');

      await expect(filesystem.write('/src', 'invalid')).rejects.toThrow(
        'Cannot write file over directory: /src',
      );
    });

    it('prevents creating directories over files', async () => {
      const filesystem = options.createFilesystem();

      await filesystem.write('/src/index.ts', 'content');

      await expect(filesystem.createDirectory('/src/index.ts')).rejects.toThrow(
        'Cannot create directory over file: /src/index.ts',
      );
    });
  });
}
