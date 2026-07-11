// packages/cli/src/register-commands.ts
import type { CAC } from 'cac';

import { registerBuildCommand } from './commands/build.command.js';
import { registerCleanCommand } from './commands/clean.command.js';
import { registerLintCommand } from './commands/lint.command.js';
import { registerValidateCommand } from './commands/validate.command.js';

export function registerCommands(cli: CAC): void {
  registerBuildCommand(cli);
  registerCleanCommand(cli);
  registerLintCommand(cli);
  registerValidateCommand(cli);
}
