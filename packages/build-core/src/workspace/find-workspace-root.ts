// packages/build-core/src/workspace/find-workspace-root.ts

import { pathExistsSync } from '../fs/fs-sync.js';
import { dirName, joinPath, resolvePath } from '../fs/path-utils.js';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

export function findWorkspaceRoot(fromDirectory: string): string {
  let current = resolvePath(fromDirectory);

  while (true) {
    const workspaceFile = joinPath(current, WORKSPACE_FILE);

    if (pathExistsSync(workspaceFile)) {
      return current;
    }

    const parent = dirName(current);

    if (parent === current) {
      throw new Error(`Unable to locate workspace root from "${fromDirectory}"`);
    }

    current = parent;
  }
}
