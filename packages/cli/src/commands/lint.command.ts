// packages/cli/src/commands/lint.command.ts

import { cwd } from 'node:process';

import type { CAC } from 'cac';

import { NodeWorkspaceProvider, resolveLintTargets } from '@arch/infrastructure';
import { lintCommand } from '@arch/tooling';

import type { LintCliOptions } from '../contracts/lint-cli-options.js';

export async function runLintCommand(options: LintCliOptions): Promise<number> {
  const workspaceProvider = new NodeWorkspaceProvider();
  const workspace = await workspaceProvider.discover(cwd());

  const targets = resolveLintTargets(workspace, options.package);
  return await lintCommand({
    targets,
    args: options.fix ? ['--fix'] : options.debug ? ['--debug'] : [],
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
