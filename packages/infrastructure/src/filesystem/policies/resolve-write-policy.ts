// packages/infrastructure/src/filesystem/policies/resolve-write-policy.ts

import type { WriteFileOptions } from '@arch/contracts';

export function shouldWriteFile(exists: boolean, options?: WriteFileOptions): boolean {
  const policy = options?.overwrite ?? 'overwrite';

  if (!exists) {
    return true;
  }

  switch (policy) {
    case 'skip':
      return false;

    case 'error':
      throw new Error('File already exists');

    case 'overwrite':
    case 'append':
    case 'merge':
    default:
      return true;
  }
}
