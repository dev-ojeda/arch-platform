// packages/cli/src/services/checks/check-paths.ts
import fs from 'node:fs';

const requiredDirectories = ['packages', 'docs'];

export async function checkPaths() {
  const missing = requiredDirectories.filter((directory) => !fs.existsSync(directory));

  return {
    name: 'paths',
    success: missing.length === 0,
    message: missing.length === 0 ? 'Required paths validated' : 'Missing required paths',
    details: missing,
  };
}
