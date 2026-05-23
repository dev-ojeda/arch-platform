// packages/tooling/src/commands/lint.ts

import { executeCommand } from '../runtime/execute-command.js';

const args = process.argv.slice(2);

await executeCommand('eslint', ['src', '--ext', '.ts', ...args]);
