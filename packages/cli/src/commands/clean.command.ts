// packages/cli/src/commands/clean.command.ts

import type { CAC } from 'cac';

import { cleanCommand } from '@arch-platform/tooling';

import type { CleanCliOptions } from '../contracts/clean-cli-options.js';
import { logger } from '../ui/logger.js';

export async function runCleanCommand(options: CleanCliOptions): Promise<number> {
  try {
    const result = await cleanCommand({
      cwd: process.cwd(),
      packageName: options.package,
    });

    return result ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(message);
    return 1;
  }
}

export function registerCleanCommand(cli: CAC): void {
  cli
    .command('clean', 'Clean workspace')
    .option('--package <packageName>', 'Clean specific package')
    .action(async (options: CleanCliOptions) => {
      return await runCleanCommand(options);
    });
}
