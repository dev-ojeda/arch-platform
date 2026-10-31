// packages\infrastructure\test\__tests__\filesystem-sync-port-contract.test.ts

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NodeSyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-sync-filesystem-adapter.js';
import { removePathSync } from '../../../src/filesystem/io/fs-sync.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

describe('NodeSyncFileSystemAdapter', () => {
  let root: string;
  let fs: NodeSyncFileSystemAdapter;

  beforeEach(() => {
    root = createTestFilesystemRoot('arch-sync-filesystem-');
    fs = new NodeSyncFileSystemAdapter({ root });
  });

  afterEach(() => {
    removePathSync(root);
  });

  describe('file operations', () => {
    it('writes and reads files', () => {
      fs.write('/src/index.ts', 'export {};');

      expect(fs.read('/src/index.ts')).toBe('export {};');
    });

    it('copies files', () => {
      fs.write('/src/source.ts', 'source');

      expect(fs.exists('/src/copy.ts')).toBe(false);

      fs.copy('/src/source.ts', '/src/copy.ts');

      expect(fs.read('/src/copy.ts')).toBe('source');
    });

    it('throws when reading missing files', () => {
      expect(() => fs.read('/missing.txt')).toThrow();
    });

    it('throws when copying missing files', () => {
      expect(() => fs.copy('/missing.txt', '/copy.txt')).toThrow();
    });

    it('throws when renaming missing files', () => {
      expect(() => fs.rename('/missing.txt', '/renamed.txt')).toThrow();
    });

    it('renames files', () => {
      fs.write('/src/source.ts', 'export {};');

      fs.rename('/src/source.ts', '/src/renamed.ts');

      expect(fs.exists('/src/source.ts')).toBe(false);
      expect(fs.exists('/src/renamed.ts')).toBe(true);
      expect(fs.read('/src/renamed.ts')).toBe('export {};');
    });

    it('removes files', () => {
      fs.write('/src/index.ts', 'content');

      fs.remove('/src/index.ts');

      expect(fs.exists('/src/index.ts')).toBe(false);
    });
  });

  describe('directory operations', () => {
    it('creates directories', () => {
      fs.createDirectory('/src/components');

      expect(fs.exists('/src/components')).toBe(true);
    });

    it('removes directories recursively', () => {
      fs.write('/src/components/button.ts', 'button');

      fs.remove('/src');

      expect(fs.exists('/src/components/button.ts')).toBe(false);
    });

    it('reads directory entries', () => {
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
      expect(fs.exists('/missing')).toBe(false);
    });

    it('normalizes paths consistently', () => {
      fs.write('\\src\\index.ts', 'normalized');

      expect(fs.read('/src/index.ts')).toBe('normalized');
    });

    it('creates parent directories automatically when writing files', () => {
      fs.write('/src/components/button.ts', 'button');

      expect(fs.exists('/src/components')).toBe(true);
    });

    it('creates parent directories recursively', () => {
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

      fs.writeJson('/config.json', value);

      expect(fs.readJson<typeof value>('/config.json')).toEqual(value);
    });
  });
});
