// packages/infrastructure/src/filesystem/paths/canonicalize-directory-entry.ts

import type { DirectoryEntry } from '@arch/contracts';

export function normalizeDirectoryEntry(entry: DirectoryEntry): DirectoryEntry {
  return {
    ...entry,
    path: normalizeSeparators(entry.path),
  };
}

export function normalizeSeparators(path: string): string {
  return path.replaceAll('\\', '/');
}

// testing
export function stripWindowsDrive(path: string): string {
  return path.replaceAll('\\', '/').replace(/^[A-Za-z]:/, '');
}
