// packages/infrastructure/test/helpers/create-filesystem-root.ts

import { tmpdir } from 'node:os';

import { createTempDirectorySync } from '../../src/filesystem/io/fs-sync.js';
import { joinPath } from '../../src/filesystem/io/path-utils.js';

export function createTestFilesystemRoot(prefix = 'arch-test'): string {
  return createTempDirectorySync(joinPath(tmpdir(), `${prefix}-`));
}
