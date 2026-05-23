// packages/tooling/src/commands/build.ts

import fs from 'node:fs';

import { executeCommand } from '../runtime/execute-command.js';

await executeCommand('pnpm', ['run', 'clean']);

const hasTsup = fs.existsSync('tsup.config.ts');

const hasTsconfigBuild = fs.existsSync('tsconfig.build.json');

if (hasTsup) {
  await executeCommand('tsup');
}

if (hasTsconfigBuild) {
  await executeCommand('tsc', ['--build', 'tsconfig.build.json']);
}
