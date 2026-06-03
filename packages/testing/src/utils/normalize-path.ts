// packages/testing/src/utils/normalize-path.ts

import path from 'node:path';

export function normalizePath(targetPath: string): string {
  return path.posix.normalize(targetPath.replaceAll('\\', '/'));
}
