// packages/build-core/src/hash/filesystem/hash-directory.ts

import { createHash } from 'node:crypto';

import { isDirectory, readDirectoryEntriesSync } from '../../fs/fs-sync.js';
import { joinPath, relativePath } from '../../fs/path-utils.js';

import { hashFile } from './hash-file.js';

const IGNORED_DIRS = new Set(['node_modules', 'dist', '.turbo', '.git']);

const IGNORED_FILES = new Set(['tsconfig.tsbuildinfo']);

export function hashDirectory(root: string): string {
  const files: string[] = [];

  function walk(dir: string): void {
    for (const entry of readDirectoryEntriesSync(dir)) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }

      if (IGNORED_FILES.has(entry.name)) {
        continue;
      }

      const fullPath = joinPath(dir, entry.name);

      if (isDirectory(fullPath)) {
        walk(fullPath);
        continue;
      }

      files.push(fullPath);
    }
  }

  walk(root);

  const hash = createHash('sha256');

  for (const file of files.sort()) {
    hash.update(relativePath(root, file));
    hash.update('\0');
    hash.update(hashFile(file));
    hash.update('\0');
  }

  return hash.digest('hex');
}
