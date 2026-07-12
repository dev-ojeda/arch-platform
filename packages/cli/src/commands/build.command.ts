// packages/cli/src/commands/build.command.ts
import process from 'node:process';

import { buildCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import type { BuildCliOptions } from '../contracts/build-cli-options.js';
import { logger } from '../ui/logger.js';

export function registerBuildCommand(cli: CAC): void {
  cli
    .command('build')
    .option('--package <packageName>', 'Build specific package')
    .action(async (options: BuildCliOptions) => {
      logger.info('cli.commands.build', {
        metadata: {
          options,
        },
      });
      process.exitCode = await buildCommand({
        packageName: options.package,
      });
    });
}
