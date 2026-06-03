// packages/cli/src/commands/test.command.ts
import { executeCommand } from '@arch/tooling/runtime/execute-command';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerTestCommand(cli: CAC): void {
  cli.command('test', 'Test workspace').action(async () => {
    logger.info('Testing workspace...');
    await executeCommand('pnpm', ['test']);
  });
}
