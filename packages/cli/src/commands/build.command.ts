// packages/cli/src/commands/build.command.ts
import process from 'node:process';

import { buildCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import type { BuildCliOptions } from '../contracts/build-cli-options.js';

export function registerBuildCommand(cli: CAC): void {
  cli
    .command('build')
    .option('--package <packageName>', 'Build specific package')
    .action(async (options: BuildCliOptions) => {
      console.log(options);
      process.exitCode = await buildCommand({
        packageName: options.package,
      });
    });
}
