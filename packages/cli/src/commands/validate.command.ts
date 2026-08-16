// validate.command.ts

import { cwd } from 'node:process';

import type { CAC } from 'cac';

import { runGovernance } from '@arch/governance';
import { findWorkspaceRoot } from '@arch/infrastructure';

import type { ValidateCliOptions } from '../contracts/validate-cli-options.js';
import { renderGovernanceResult } from '../renderers/render-diagnostics.js';

export async function runValidateCommand(options: ValidateCliOptions): Promise<number> {
  const workspaceRoot = findWorkspaceRoot(cwd());

  const result = await runGovernance({
    workspaceRoot,
    packageName: options.package,
  });

  renderGovernanceResult(result);

  return result.success ? 0 : 1;
}

export function registerValidateCommand(cli: CAC): void {
  cli
    .command('validate', 'Validate workspace')
    .option('--package <package>', 'Validate package')
    .action(async (options: ValidateCliOptions) => {
      process.exitCode = await runValidateCommand(options);
    });
}
