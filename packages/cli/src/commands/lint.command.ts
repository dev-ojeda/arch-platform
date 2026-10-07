// packages/cli/src/commands/lint.command.ts

import { cwd } from 'node:process';

import type { CAC } from 'cac';

import { lintCommand } from '@arch-platform/tooling';

import type { LintCliOptions } from '../contracts/lint-cli-options.js';

export async function runLintCommand(options: LintCliOptions): Promise<number> {
  return await lintCommand({
    workspaceRoot: cwd(),
    packageName: options.package,
    fix: options.fix,
    debug: options.debug,
  });
}
export function registerLintCommand(cli: CAC): void {
  cli
    .command('lint', 'Lint workspace')
    .option('--package <package>', 'Lint specific package')
    .option('--fix', 'Automatically fix problems')
    .option('--debug', 'Debugger lint')
    .action(async (options: LintCliOptions) => {
      return await runLintCommand(options);
    });
}
