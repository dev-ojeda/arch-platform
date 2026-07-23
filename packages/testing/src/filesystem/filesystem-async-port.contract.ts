// packages/testing/src/filesystem/filesystem-async-port-contract.ts

import type { FileSystemAsyncPort } from '@arch/contracts';
import { describe, expect, it } from 'vitest';

export function runFileSystemAsyncPortContract(
  createFileSystem: () => Promise<FileSystemAsyncPort>,
): void {
  describe('FileSystemAsyncPort contract', () => {
    describe('file operations', () => {
      it('writes and reads files', async () => {
        const fs = await createFileSystem();

        await fs.write('/src/source.ts', 'content');

        const result = await fs.read('/src/source.ts');

        expect(result).toBe('content');
      });
      it('renames files', async () => {
        const fs = await createFileSystem();

        await fs.write('/src/source.ts', 'export {};');

        await fs.rename('/src/source.ts', '/src/renamed.ts');

        expect(await fs.exists('/src/source.ts')).toBe(false);
        expect(await fs.exists('/src/renamed.ts')).toBe(true);
        expect(await fs.read('/src/renamed.ts')).toBe('export {};');
      });
      it('copies files', async () => {
        const fs = await createFileSystem();

        await fs.write('/src/source.ts', 'content');

        await fs.copy('/src/source.ts', '/src/copy.ts');

        const result = await fs.read('/src/copy.ts');

        expect(result).toBe('content');
      });

      it('throws when reading missing files', async () => {
        const fs = await createFileSystem();

        await expect(fs.read('/missing.txt')).rejects.toThrow();
      });

      it('throws when copying missing files', async () => {
        const fs = await createFileSystem();

        await expect(fs.copy('/missing.txt', '/copy.txt')).rejects.toThrow();
      });
      it('throws when renaming missing files', async () => {
        const fileSystem = await createFileSystem();

        await expect(fileSystem.rename('/missing.txt', '/renamed.txt')).rejects.toThrow(
          /File not found/,
        );
      });
      it('removes files', async () => {
        const fs = await createFileSystem();

        await fs.write('/src/source.ts', 'content');

        await fs.remove('/src/source.ts');

        expect(await fs.exists('/src/source.ts')).toBe(false);
      });
    });

    describe('directory operations', () => {
      it('creates directories', async () => {
        const fs = await createFileSystem();

        await fs.createDirectory('/src/domain');

        const entries = await fs.readDirectory('/src');

        expect(entries.length).toBeGreaterThan(0);
      });

      it('removes directories recursively', async () => {
        const fs = await createFileSystem();

        await fs.write('/src/domain/file.ts', 'content');

        await fs.remove('/src');

        expect(await fs.exists('/src')).toBe(false);
      });

      it('reads directory entries', async () => {
        const fs = await createFileSystem();

        await fs.write('/src/file.ts', 'content');

        const entries = await fs.readDirectory('/src');

        expect(entries.some((entry) => entry.name === 'file.ts')).toBe(true);
      });
    });

    describe('path handling', () => {
      it('returns false for missing paths', async () => {
        const fs = await createFileSystem();

        expect(await fs.exists('/missing')).toBe(false);
      });

      it('creates parent directories automatically when writing files', async () => {
        const fs = await createFileSystem();

        await fs.write('/a/b/c/file.txt', 'content');

        expect(await fs.exists('/a/b/c/file.txt')).toBe(true);
      });
    });

    describe('json operations', () => {
      it('writes and reads json', async () => {
        const fs = await createFileSystem();

        const data = {
          name: 'arch-platform',
        };

        await fs.writeJson('/config.json', data);

        const result = await fs.readJson('/config.json');

        expect(result).toEqual(data);
      });
    });
  });
}
