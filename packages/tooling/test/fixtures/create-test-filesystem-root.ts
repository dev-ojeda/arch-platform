import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTempDirectorySync } from '@arch-platform/infrastructure';

export function createTestFilesystemRoot(prefix = 'arch-test'): string {
  return createTempDirectorySync(join(tmpdir(), `${prefix}-`));
}
