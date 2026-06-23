// packages/tooling/src/runtime/filesystem/path-exists.ts

import { lstatSync } from 'node:fs';

/**
 * Returns true when a filesystem path exists.
 *
 * Supports:
 * - files
 * - directories
 * - valid symlinks
 */
export function pathExists(targetPath: string): boolean {
  try {
    lstatSync(targetPath);
    return true;
  } catch {
    return false;
  }
}
