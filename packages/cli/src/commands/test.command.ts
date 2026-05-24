// packages/cli/src/commands/test.command.ts
import type { CAC } from 'cac';

import { runCommand } from '../utils/command-runner.js';
import { info } from '../utils/logger.js';

export function registerTestCommand(cli: CAC): void {
  cli.command('test', 'Test workspace').action(async () => {
    info('Testing workspace...');
    await runCommand('pnpm', ['test']);
  });
}
