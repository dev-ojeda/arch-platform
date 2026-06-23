// packages/cli/src/commands/build.command.ts

import { buildCommand } from '@arch/tooling';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerBuildCommand(cli: CAC): void {
  cli.command('build [package]', 'Build workspace').action(async (packageName?: string) => {
    logger.info('Building workspace...');

    const target = packageName ?? '@arch/application';

    const exitCode = await buildCommand(target);

    process.exitCode = exitCode;
  });
}
