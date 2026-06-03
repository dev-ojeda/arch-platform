// packages/cli/src/commands/build.command.ts

import { buildCommand } from '@arch/tooling/commands/build';
import type { CAC } from 'cac';

import { logger } from '../ui/logger.js';

export function registerBuildCommand(cli: CAC): void {
  cli.command('build', 'Build workspace').action(async () => {
    logger.info('Building workspace...');

    await buildCommand();
  });
}
