// validate.command.ts

import { cwd } from 'node:process';

import { renderDiagnostics, validateWorkspace } from '@arch/governance';
import type { CAC } from 'cac';

export async function runValidateCommand(): Promise<number> {
  const diagnostics = await validateWorkspace(cwd());

  renderDiagnostics(diagnostics);

  return diagnostics.some((diagnostic) => diagnostic.severity === 'error') ? 1 : 0;
}

export function registerValidateCommand(cli: CAC): void {
  cli.command('validate', 'Validate workspace').action(async () => {
    process.exitCode = await runValidateCommand();
  });
}
