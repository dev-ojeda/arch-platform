// validate.command.ts

import { cwd } from 'node:process';

import { runGovernance, type GovernanceScope } from '@arch/governance';


import { createGovernanceDependencies } from '../composition/governance-composition.js';
import { renderDiagnostics } from '../renderers/render-diagnostics.js';

import type { ValidateCliOptions } from '../contracts/validate-cli-options.js';
import type { CAC } from 'cac';

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
  const diagnostics = await runGovernance(scope, workspaceProvider);

  renderDiagnostics(diagnostics, scope);

  return diagnostics.some((diagnostic) => diagnostic.severity === 'error') ? 1 : 0;
}

export function registerValidateCommand(cli: CAC): void {
  cli
    .command('validate', 'Validate workspace')
    .option('--package <package>', 'Validate package')
    .action(async (options: ValidateCliOptions) => {
      process.exitCode = await runValidateCommand(options);
    });
}
