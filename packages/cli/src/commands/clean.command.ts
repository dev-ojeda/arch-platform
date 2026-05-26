// packages/cli/src/commands/clean.command.ts

import { executeCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerCleanCommand(cli: CAC) {
  cli.command('clean', 'Clean workspace').action(async () => {
    logger.info('Cleaning workspace...');

    await executeCommand('pnpm', ['clean']);
  });
}
