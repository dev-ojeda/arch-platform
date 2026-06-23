// packages/build-core/src/state/state-paths.ts

import { ensureDir, writeTextFile } from '../fs/fs-async.js';
import { dirName, getStatePath } from '../fs/path-utils.js';
import { safeStringify } from '../serialization/safe-stringify.js';

import type { BuildState } from './state-types.js';

export async function persistBuildState(workspaceRoot: string, state: BuildState): Promise<void> {
  const statePath = getStatePath(workspaceRoot);

  await ensureDir(dirName(statePath));

  await writeTextFile(statePath, safeStringify(state, 2));
}
