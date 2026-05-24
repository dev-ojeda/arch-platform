// packages/tooling/src/runtime/remove-path.ts

import { chmod, rm } from 'node:fs/promises';

export async function removePath(targetPath: string): Promise<void> {
  try {
    await chmod(targetPath, 0o666).catch(() => undefined);

    await rm(targetPath, {
      recursive: true,
      force: true,

      maxRetries: 5,

      retryDelay: 250,
    });
  } catch {
    // noop
  }
}
