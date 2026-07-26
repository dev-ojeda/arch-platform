// packages/cli/src/commands/typecheck.command.ts

import { typecheckCommand } from '@arch/tooling';

import { logger } from '../ui/logger.js';

import type { CAC } from 'cac';


export function registerTypecheckCommand(cli: CAC): void {
  cli.command('typecheck', 'Typecheck workspace').action(async () => {
    logger.info('Typechecking workspace...');

    await typecheckCommand({
      noEmit: true,
    });
  });
}
