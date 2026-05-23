// packages/tooling/src/commands/dev.ts

import fs from 'node:fs';

import { executeCommand } from '../runtime/execute-command.js';

const hasTsup = fs.existsSync('tsup.config.ts');

if (hasTsup) {
  await executeCommand('tsup', ['--watch']);
}
