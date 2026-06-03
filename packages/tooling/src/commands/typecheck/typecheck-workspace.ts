// packages/tooling/src/commands/typecheck/typecheck-workspace.ts

import { runTypecheckCommand } from './typecheck-command.js';

export async function typecheckWorkspace(): Promise<number> {
  return (await runTypecheckCommand()).exitCode;
}
