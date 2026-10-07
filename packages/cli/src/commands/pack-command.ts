// packages/cli/src/commands/pack-command.ts

import { cwd } from 'process';

import type { CAC } from 'cac';

import { packCommand } from '@arch-platform/tooling';

import type { PackCliOptions } from '../contracts/pack-cli-options.js';

export async function runPackCommand(options: PackCliOptions): Promise<number> {
  return await packCommand({
    cwd: cwd(),
    packageName: options.package,
    outputDirectory: options.out,
  });
}

export function registerPackCommand(cli: CAC): void {
  cli
    .command('pack', 'Pack workspace')
    .option('--package <packageName>', 'Package to pack')
    .option('--out <directory>', 'Output directory for the generated tarball')
    .option('--ignore-scripts', 'Ignore package lifecycle scripts')
    .option('--json', 'Log output in JSON format')
    .action(async (options: PackCliOptions) => {
      return await runPackCommand(options);
    });
}
