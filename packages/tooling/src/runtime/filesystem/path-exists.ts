// packages/tooling/src/runtime/filesystem/path-exists.ts

import { existsSync } from 'node:fs';

/**
 * Returns true when a filesystem path exists.
 *
 * Supports:
 * - files
 * - directories
 * - symlinks
 */
export function pathExists(targetPath: string): boolean {
  return existsSync(targetPath);
}
