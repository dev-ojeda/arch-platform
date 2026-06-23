// packages/cli/src/commands/clean.command.ts

import { cleanCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerCleanCommand(cli: CAC): void {
  cli.command('clean', 'Clean workspace').action(async () => {
    logger.info('Cleaning workspace...');

    await cleanCommand();
  });
}
