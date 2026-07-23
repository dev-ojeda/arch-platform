// validate.command.ts

import { cwd } from 'node:process';

import { runGovernance } from '@arch/governance';
import type { CAC } from 'cac';

import { createGovernanceDependencies } from '../composition/governance-composition.js';
import { renderDiagnostics } from '../renderers/render-diagnostics.js';

export async function runValidateCommand(): Promise<number> {
  const { workspaceProvider } = createGovernanceDependencies();

  const diagnostics = await runGovernance(
    {
      kind: 'workspace',
      root: cwd(),
    },
    workspaceProvider,
  );

  renderDiagnostics(diagnostics);

  return diagnostics.some((diagnostic) => diagnostic.severity === 'error') ? 1 : 0;
}

export function registerValidateCommand(cli: CAC): void {
  cli.command('validate', 'Validate workspace').action(async () => {
    process.exitCode = await runValidateCommand();
  });
}
