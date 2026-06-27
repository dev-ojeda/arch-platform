// packages/tooling/src/workspace/find-workspace-root.ts

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

export function findWorkspaceRoot(startDir: string): string {
  let current = resolve(startDir);

  while (true) {
    const workspaceFile = join(current, WORKSPACE_FILE);

    if (existsSync(workspaceFile)) {
      return current;
    }

    const parent = dirname(current);

    if (parent === current) {
      throw new Error(`Unable to locate workspace root from "${startDir}"`);
    }

    current = parent;
  }
}
