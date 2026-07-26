// packages/cli/src/commands/build.command.ts
import process from 'node:process';

import { buildCommand } from '@arch/tooling';

import { logger } from '../ui/logger.js';

import type { BuildCliOptions } from '../contracts/build-cli-options.js';
import type { CAC } from 'cac';


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
