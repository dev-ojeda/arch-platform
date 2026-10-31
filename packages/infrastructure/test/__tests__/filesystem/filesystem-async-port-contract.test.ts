// packages/infrastructure/test/__tests__/filesystem-async-port-contract.test.ts

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { NodeAsyncFileSystemAdapter } from '../../../src/filesystem/adapters/node-async-filesystem-adapter.js';
import { removePath } from '../../../src/filesystem/io/fs-async.js';
import { createTestFilesystemRoot } from '../../helpers/create-filesystem-root.js';

describe('NodeAsyncFileSystemAdapter', () => {
  let root: string;
  let fs: NodeAsyncFileSystemAdapter;

  beforeEach(async () => {
    root = createTestFilesystemRoot('arch-async-filesystem-');
    fs = new NodeAsyncFileSystemAdapter({ root });
  });

  afterEach(async () => {
    await removePath(root);
  });

  describe('file operations', () => {
    it('writes and reads files', async () => {
      await fs.write('/src/source.ts', 'content');

      expect(await fs.read('/src/source.ts')).toBe('content');
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

    it('throws when reading missing files', async () => {
      await expect(fs.read('/missing.txt')).rejects.toThrow();
    });

    it('throws when copying missing files', async () => {
      await expect(fs.copy('/missing.txt', '/copy.txt')).rejects.toThrow();
    });

    it('throws when renaming missing files', async () => {
      await expect(fs.rename('/missing.txt', '/renamed.txt')).rejects.toThrow();
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

      const entries = await fs.readDirectory('/src');

      expect(entries.length).toBeGreaterThan(0);
    });

    it('removes directories recursively', async () => {
      await fs.write('/src/domain/file.ts', 'content');
      await fs.remove('/src');

      expect(await fs.exists('/src')).toBe(false);
    });

    it('reads directory entries', async () => {
      await fs.write('/src/file.ts', 'content');

      const entries = await fs.readDirectory('/src');

      expect(entries.some((entry) => entry.name === 'file.ts')).toBe(true);
    });
  });

  describe('path handling', () => {
    it('returns false for missing paths', async () => {
      expect(await fs.exists('/missing')).toBe(false);
    });

    it('creates parent directories automatically when writing files', async () => {
      await fs.write('/a/b/c/file.txt', 'content');

      expect(await fs.exists('/a/b/c/file.txt')).toBe(true);
    });
  });

  describe('json operations', () => {
    it('writes and reads json', async () => {
      const data = {
        name: 'arch-platform',
      };

      await fs.writeJson('/config.json', data);

      expect(await fs.readJson('/config.json')).toEqual(data);
    });

    it('omits undefined properties when writing json', async () => {
      await fs.writeJson('/config.json', {
        name: 'arch-platform',
        optional: undefined,
      });

      const result = await fs.readJson<{
        name: string;
        optional?: unknown;
      }>('/config.json');

      expect(result).toEqual({
        name: 'arch-platform',
      });
    });
  });
});
