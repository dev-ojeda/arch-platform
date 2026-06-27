// packages/testing/src/utils/normalize-path.ts

import { posix } from 'node:path';

export function normalizePath(targetPath: string): string {
  return posix.normalize(targetPath.replaceAll('\\', '/'));
}
