// packages/cli/src/run-cli.ts

import { cac } from 'cac';

import { registerCommands } from './register-commands.js';

export function runCli() {
  const cli = cac('arch');

  registerCommands(cli);

  cli.help();

  return cli;
}
