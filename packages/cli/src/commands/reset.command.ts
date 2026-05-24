// packages/cli/src/commands/reset.command.ts
import type { CAC } from 'cac';

import { runCommand } from '../utils/command-runner.js';
import { info } from '../utils/logger.js';

export function registerResetCommand(cli: CAC): void {
  cli.command('reset', 'Reset workspace').action(async () => {
    info('Reseting workspace...');
    await runCommand('pnpm', ['reset']);
  });
}
