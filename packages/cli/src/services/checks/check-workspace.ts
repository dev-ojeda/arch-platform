// packages/cli/src/services/checks/check-workspace.ts
import fs from 'node:fs';
import path from 'node:path';

export async function checkWorkspace() {
  const workspacePath = path.resolve('pnpm-workspace.yaml');

  const exists = fs.existsSync(workspacePath);

  return {
    name: 'workspace',
    success: exists,
    message: exists ? 'pnpm-workspace.yaml found' : 'pnpm-workspace.yaml missing',
    details: [],
  };
}
