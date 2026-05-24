// packages/cli/src/commands/build.command.ts

import type { CAC } from 'cac';

import { runCommand } from '../utils/command-runner.js';
import { info } from '../utils/logger.js';

export function registerBuildCommand(cli: CAC): void {
  cli.command('build', 'Build workspace').action(async () => {
    info('Building workspace...');
    await runCommand('pnpm', ['build']);
  });
}
