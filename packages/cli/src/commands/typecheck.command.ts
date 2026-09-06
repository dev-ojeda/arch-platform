// packages/cli/src/commands/typecheck.command.ts

import type { CAC } from 'cac';

import { typecheckCommand } from '@arch-platform/tooling';

export function registerTypecheckCommand(cli: CAC): void {
  cli.command('typecheck', 'Typecheck workspace').action(async () => {
    await typecheckCommand({
      noEmit: true,
    });
  });
}
