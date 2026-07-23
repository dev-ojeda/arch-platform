// packages/testing/src/filesystem/filesystem-sync-port.contract.ts

import type { FileSystemSyncPort } from '@arch/contracts';
import { describe, expect, it } from 'vitest';

export function runFileSystemSyncPortContract(createFileSystem: () => FileSystemSyncPort): void {
  describe('FileSystemSyncPort contract', () => {
    describe('file operations', () => {
      it('writes and reads files', () => {
        const fs = createFileSystem();

        fs.write('/src/index.ts', 'export {};');

        expect(fs.read('/src/index.ts')).toBe('export {};');
      });
      it('copies files', () => {
        const fs = createFileSystem();

        fs.write('/src/source.ts', 'source');
        expect(fs.exists('/src/copy.ts')).toBe(false);
        fs.copy('/src/source.ts', '/src/copy.ts');
        expect(fs.read('/src/copy.ts')).toBe('source');
      });
      it('throws when reading missing files', () => {
        const fs = createFileSystem();

        expect(() => fs.read('/missing.txt')).toThrow();
      });

      it('throws when copying missing files', () => {
        const fs = createFileSystem();

        expect(() => fs.copy('/missing.txt', '/copy.txt')).toThrow();
      });
      it('throws when renaming missing files', () => {
        const fs = createFileSystem();

        expect(() => fs.rename('missing.txt', 'renamed.txt')).toThrow('File not found');
      });
      it('renames files', () => {
        const fs = createFileSystem();

        fs.write('/src/source.ts', 'export {};');

        fs.rename('/src/source.ts', '/src/renamed.ts');

        expect(fs.exists('/src/source.ts')).toBe(false);
        expect(fs.exists('/src/renamed.ts')).toBe(true);
        expect(fs.read('/src/renamed.ts')).toBe('export {};');
      });
      it('removes files', () => {
        const fs = createFileSystem();

        fs.write('/src/index.ts', 'content');

        fs.remove('/src/index.ts');

        expect(fs.exists('/src/index.ts')).toBe(false);
      });
    });
    describe('directory operations', () => {
      it('creates directories', () => {
        const fs = createFileSystem();

        fs.createDirectory('/src/components');

        expect(fs.exists('/src/components')).toBe(true);
      });

      it('removes directories recursively', () => {
        const fs = createFileSystem();

        fs.write('/src/components/button.ts', 'button');

        fs.remove('/src');

        expect(fs.exists('/src/components/button.ts')).toBe(false);
      });

      it('reads directory entries', () => {
        const fs = createFileSystem();

        fs.createDirectory('/src/components');

        fs.write('/src/index.ts', 'index');

        fs.write('/src/main.ts', 'main');

        const entries = fs.readDirectory('/src');

        expect(entries).toHaveLength(3);

        expect(entries).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: 'components',
              isDirectory: true,
            }),
            expect.objectContaining({
              name: 'index.ts',
              isDirectory: false,
            }),
            expect.objectContaining({
              name: 'main.ts',
              isDirectory: false,
            }),
          ]),
        );
      });
    });
    describe('path handling', () => {
      it('returns false for missing paths', () => {
        const fs = createFileSystem();

        expect(fs.exists('/missing')).toBe(false);
      });

      it('normalizes paths consistently', () => {
        const fs = createFileSystem();

        fs.write('\\src\\index.ts', 'normalized');

        expect(fs.read('/src/index.ts')).toBe('normalized');
      });

      it('creates parent directories automatically when writing files', () => {
        const fs = createFileSystem();

        fs.write('/src/components/button.ts', 'button');

        expect(fs.exists('/src/components')).toBe(true);
      });

      it('creates parent directories recursively', () => {
        const fs = createFileSystem();

        fs.write('/src/a/b/c/file.ts', 'content');

        expect(fs.exists('/src')).toBe(true);
        expect(fs.exists('/src/a')).toBe(true);
        expect(fs.exists('/src/a/b')).toBe(true);
        expect(fs.exists('/src/a/b/c')).toBe(true);
      });
    });
    describe('json operations', () => {
      it('writes and reads json', () => {
        const value = {
          name: 'arch',
          version: 1,
        };
        const fs = createFileSystem();

        fs.writeJson('/config.json', value);

        expect(fs.readJson<typeof value>('/config.json')).toEqual(value);
      });
    });
  });
}
