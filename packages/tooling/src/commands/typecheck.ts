// packages/tooling/src/commands/typecheck.ts

import fs from 'node:fs';

import { executeCommand } from '../runtime/execute-command.js';

const hasTsconfigBuild = fs.existsSync('tsconfig.build.json');

if (hasTsconfigBuild) {
  await executeCommand('tsc', ['--build']);
}
