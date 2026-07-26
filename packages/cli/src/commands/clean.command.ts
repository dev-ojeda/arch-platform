// packages/cli/src/commands/clean.command.ts

import { cleanCommand } from '@arch/tooling';

import type { CAC } from 'cac';

export function registerCleanCommand(cli: CAC): void {
  cli.command('clean', 'Clean workspace').action(async () => {
    await cleanCommand({});
  });
}
