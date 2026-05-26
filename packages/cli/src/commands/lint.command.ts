// packages/cli/src/commands/lint.command.ts

import { executeCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerLintCommand(cli: CAC): void {
  cli.command('lint', 'Lint workspace').action(async () => {
    logger.info('Linting workspace...');
    await executeCommand('pnpm', ['lint']);
  });
}
