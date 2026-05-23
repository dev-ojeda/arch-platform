// packages/tooling/src/commands/clean.ts

import fs from 'node:fs';
import path from 'node:path';

import { executeCommand } from '../runtime/execute-command.js';

await executeCommand('rimraf', ['dist', 'coverage']);

const cwd = process.cwd();

const entries = fs.readdirSync(cwd);

for (const entry of entries) {
  if (entry.endsWith('.tsbuildinfo')) {
    await executeCommand('rimraf', [path.join(cwd, entry)]);
  }
}
