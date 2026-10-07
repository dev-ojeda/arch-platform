// packages/cli/src/commands/security-command.ts

import process from 'node:process';

import type { CAC } from 'cac';

import { runSecurity } from '@arch-platform/compliance';

import type { SecurityCliOptions } from '../contracts/security-cli-options.js';
import { renderSecurityResult } from '../renderers/render-security.js';

export async function runSecurityCommand(options: SecurityCliOptions): Promise<number> {
  try {
    const result = await runSecurity({
      workspaceRoot: process.cwd(),
      packageName: options.package,
      environment: options.env,
      lockfilePath: options.lockfile,
    });

    renderSecurityResult(result);
    return result.success ? 0 : 1;
  } catch {
    return 1;
  }
}

export function registerSecurityCommand(cli: CAC): void {
  cli
    .command('security', 'Security workspace')
    .option('--package <package>', 'Security package')
    .option('--env <environment>', 'Security environment')
    .option('--lockfile <path>', 'Security lockfile path')
    .action(async (options: SecurityCliOptions) => {
      process.exitCode = await runSecurityCommand(options);
    });
}
