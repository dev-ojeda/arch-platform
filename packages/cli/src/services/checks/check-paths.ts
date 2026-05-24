// packages/cli/src/services/checks/check-paths.ts
import fs from 'node:fs';

const requiredPaths = ['packages/*', 'configs/*', 'docs'];

export async function checkPaths() {
  const missing = requiredPaths.filter((path) => !fs.existsSync(path));

  return {
    name: 'paths',
    success: missing.length === 0,
    message: missing.length === 0 ? 'Required paths validated' : 'Missing required paths',
    details: missing,
  };
}
