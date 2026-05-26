// packages/tooling/src/commands/build.ts

import fs from 'node:fs';

import { executeCommand } from '../runtime/execute-command.js';

const args = process.argv.slice(2);

const TSUP_CONFIG_PATH = 'tsup.config.ts';

if (!fs.existsSync(TSUP_CONFIG_PATH)) {
  console.warn(`[tooling:build] Missing ${TSUP_CONFIG_PATH}. Skipping build.`);

  process.exit(0);
}

const result = await executeCommand('tsup', [...args]);

if (result.exitCode !== 0) {
  process.exit(result.exitCode);
}
