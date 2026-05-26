// packages/tooling/src/commands/typecheck.ts

import fs from 'node:fs';

import { executeCommand } from '../runtime/execute-command.js';

const args = process.argv.slice(2);

const TSCONFIG_BUILD_PATH = 'tsconfig.build.json';

if (!fs.existsSync(TSCONFIG_BUILD_PATH)) {
  console.warn(`[tooling:typecheck] Missing ${TSCONFIG_BUILD_PATH}. Skipping typecheck.`);

  process.exit(0);
}

const result = await executeCommand('tsc', ['-p', TSCONFIG_BUILD_PATH, '--noEmit', ...args]);

if (result.exitCode !== 0) {
  process.exit(result.exitCode);
}
