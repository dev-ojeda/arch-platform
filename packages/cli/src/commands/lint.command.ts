// packages/cli/src/commands/lint.command.ts

import { lintCommand } from '@arch/tooling';
import type { CAC } from 'cac';

export function registerLintCommand(cli: CAC): void {
  cli.command('lint', 'Lint workspace').action(async () => {
    return await lintCommand({});
  });
}
