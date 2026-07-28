// packages/cli/src/commands/typecheck.command.ts

import type { CAC } from 'cac';

import { typecheckCommand } from '@arch/tooling';

import { logger } from '../ui/logger.js';

export function registerTypecheckCommand(cli: CAC): void {
  cli.command('typecheck', 'Typecheck workspace').action(async () => {
    logger.info('Typechecking workspace...');

    await typecheckCommand({
      noEmit: true,
    });
  });
}
