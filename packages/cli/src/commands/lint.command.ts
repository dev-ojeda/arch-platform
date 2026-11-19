// packages/cli/src/commands/lint.command.ts

import type { CAC } from 'cac';

import type { LintCliOptions } from '../contracts/lint-cli-options.js';
import { logger } from '../ui/logger.js';

export async function runLintCommand(options: LintCliOptions): Promise<number> {
  try {
    const { lintCommand } = await import('@arch-platform/tooling');
    const result = await lintCommand({
      workspaceRoot: process.cwd(),
      packageName: options.package,
      fix: options.fix,
      debug: options.debug,
    });
    return result ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    logger.error(message);
    return 1;
  }
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
