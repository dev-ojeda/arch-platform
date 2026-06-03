// packages/tooling/src/runtime/filesystem/remove-paths.ts

import { removePath } from './remove-path.js';

export async function removePaths(paths: readonly string[]): Promise<void> {
  await Promise.all(paths.map((targetPath) => removePath(targetPath)));
}
