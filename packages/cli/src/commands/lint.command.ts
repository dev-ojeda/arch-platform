// packages/cli/src/commands/lint.command.ts

import { lintCommand } from '@arch/tooling';

import type { LintCliOptions } from '../contracts/lint-cli-options.js';
import type { CAC } from 'cac';

export function registerLintCommand(cli: CAC): void {
  cli
    .command('lint', 'Lint workspace')
    .option('--fix', 'Automatically fix problems')
    .action(async (options: LintCliOptions) => {
      return await lintCommand({
        args: options.fix ? ['--fix'] : [],
      });
    });
}
