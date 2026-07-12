// packages/cli/src/commands/typecheck.command.ts

import { typecheckCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerTypecheckCommand(cli: CAC): void {
  cli.command('typecheck', 'Typecheck workspace').action(async () => {
    logger.info('Typechecking workspace...');

    await typecheckCommand({
      noEmit: true,
    });
  });
}
