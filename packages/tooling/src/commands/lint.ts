// packages/tooling/src/commands/lint.ts
import fs from 'node:fs';

import { executeCommand } from '../runtime/execute-command.js';

const args = process.argv.slice(2);

const lintTargets = ['src', 'testing'].filter((path) => fs.existsSync(path));

if (lintTargets.length === 0) {
  console.warn('[tooling:lint] No lint targets found.');

  process.exit(0);
}

const result = await executeCommand('eslint', [
  ...lintTargets,

  '--ext',
  '.ts,.tsx',

  '--max-warnings',
  '0',

  ...args,
]);

if (result.exitCode !== 0) {
  process.exit(result.exitCode);
}
