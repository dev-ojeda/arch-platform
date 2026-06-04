// packages/tooling/src/utils/directory-exists.ts

import fs from 'node:fs';

export function directoryExists(directoryPath: string): boolean {
  try {
    return fs.statSync(directoryPath).isDirectory();
  } catch {
    return false;
  }
}
