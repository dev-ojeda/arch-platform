// packages/cli/src/commands/validate.command.ts

import type { CAC } from 'cac';

import { runCommand } from '../utils/command-runner.js';
import { info } from '../utils/logger.js';

export function registerValidateCommand(cli: CAC) {
  cli.command('validate', 'Validate architecture').action(async () => {
    info('Validating architecture...');

    await runCommand('pnpm', ['validate']);
  });
}
