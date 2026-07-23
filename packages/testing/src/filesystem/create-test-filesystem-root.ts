// packages/testing/src/filesystem/create-test-filesystem-root.ts

import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

export function createTestFilesystemRoot(prefix = 'arch-test'): string {
  return mkdtempSync(join(tmpdir(), `${prefix}-`));
}
