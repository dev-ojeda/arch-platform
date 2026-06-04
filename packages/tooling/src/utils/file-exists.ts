// packages/tooling/src/utils/file-exists.ts

import fs from 'node:fs';

export function fileExists(path: string): boolean {
  return fs.existsSync(path);
}
