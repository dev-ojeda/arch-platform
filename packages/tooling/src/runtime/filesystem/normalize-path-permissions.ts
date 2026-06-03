// packages/tooling/src/runtime/filesystem/normalize-path-permissions.ts

import { chmod } from 'node:fs/promises';

export async function normalizePathPermissions(targetPath: string): Promise<void> {
  try {
    await chmod(targetPath, 0o777);
  } catch {
    // ignore
  }
}
