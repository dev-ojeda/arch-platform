// packages/cli/src/commands/clean.command.ts

import type { CAC } from 'cac';

import { cleanCommand } from '@arch/tooling';

export function registerCleanCommand(cli: CAC): void {
  cli.command('clean', 'Clean workspace').action(async () => {
    await cleanCommand({});
  });
}
