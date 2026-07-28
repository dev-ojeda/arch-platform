// validate.command.ts

import { cwd } from 'node:process';

import type { CAC } from 'cac';

import { runGovernance, type GovernanceScope } from '@arch/governance';

import { createGovernanceDependencies } from '../composition/governance-composition.js';
import type { ValidateCliOptions } from '../contracts/validate-cli-options.js';
import { renderGovernanceResult } from '../renderers/render-diagnostics.js';

export async function runValidateCommand(options: ValidateCliOptions): Promise<number> {
  const { workspaceProvider } = createGovernanceDependencies();

  const scope: GovernanceScope = options.package
    ? {
        kind: 'package',
        root: cwd(),
        packageName: options.package,
      }
    : {
        kind: 'workspace',
        root: cwd(),
      };

  const result = await runGovernance(scope, workspaceProvider);

  renderGovernanceResult(result, scope);

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
