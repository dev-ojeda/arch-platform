// packages/cli/src/commands/compliance-command.ts

import process from 'node:process';

import type { CAC } from 'cac';

import { runGovernance } from '@arch/governance';

import type { ComplianceCliOptions } from '../contracts/compliance-cli-options.js';

export async function runComplianceCommand(options: ComplianceCliOptions): Promise<number> {
  const result = await runGovernance({
    workspaceRoot: process.cwd(),
    packageName: options.package,
  });

  return result.success ? 0 : 1;
}

export function registerComplianceCommand(cli: CAC): void {
  cli
    .command('compliance', 'Compliance workspace')
    .option('--package <package>', 'Compliance package')
    .action(async (options: ComplianceCliOptions) => {
      process.exitCode = await runComplianceCommand(options);
    });
}
