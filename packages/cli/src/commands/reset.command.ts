// packages/cli/src/commands/reset.command.ts
import { executeCommand } from '@arch/tooling/runtime/execute-command';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerResetCommand(cli: CAC): void {
  cli.command('reset', 'Reset workspace').action(async () => {
    logger.info('Reseting workspace...');
    await executeCommand('pnpm', ['reset']);
  });
}
