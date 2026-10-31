// packages/cli/src/commands/typecheck.command.ts

import type { CAC } from 'cac';

import { typecheckCommand } from '@arch-platform/tooling';

import type { TypecheckCliOptions } from '../contracts/typecheck-cli-options.js';
import { logger } from '../ui/logger.js';

export async function runTypecheckCommand(options: TypecheckCliOptions): Promise<number> {
  try {
    return await typecheckCommand({
      cwd: process.cwd(),
      packageName: options.package,
      noEmit: true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(`Error durante el typecheck: ${message}`);
    return 1;
  }
}

export function registerTypecheckCommand(cli: CAC): void {
  cli
    .command('typecheck', 'Typecheck workspace')
    .option('--package <packageName>', 'Typecheck a specific package')
    .action(async (options: TypecheckCliOptions) => {
      process.exitCode = await runTypecheckCommand(options);
    });
}
