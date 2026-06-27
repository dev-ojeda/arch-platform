// packages/tooling/src/utils/directory-exists.ts

import { statSync } from 'node:fs';

export function directoryExists(directoryPath: string): boolean {
  try {
    return statSync(directoryPath).isDirectory();
  } catch {
    return false;
  }
}
