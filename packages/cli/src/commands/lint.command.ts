// packages/cli/src/commands/lint.command.ts

import type { CAC } from 'cac';

import { runCommand } from '../utils/command-runner.js';
import { info } from '../utils/logger.js';

export function registerLintCommand(cli: CAC): void {
  cli.command('lint', 'Lint workspace').action(async () => {
    info('Linting workspace...');
    await runCommand('pnpm', ['lint']);
  });
}
