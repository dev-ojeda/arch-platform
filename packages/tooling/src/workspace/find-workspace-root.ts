// packages/tooling/src/workspace/find-workspace-root.ts

import fs from 'node:fs';
import path from 'node:path';

const WORKSPACE_FILE = 'pnpm-workspace.yaml';

export function findWorkspaceRoot(startDir: string): string {
  let current = path.resolve(startDir);

  while (true) {
    const workspaceFile = path.join(current, WORKSPACE_FILE);

    if (fs.existsSync(workspaceFile)) {
      return current;
    }

    const parent = path.dirname(current);

    if (parent === current) {
      throw new Error(`Unable to locate workspace root from "${startDir}"`);
    }

    current = parent;
  }
}
