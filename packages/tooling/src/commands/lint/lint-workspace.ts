// packages/tooling/src/commands/lint/lint-workspace.ts

import { runLintCommand } from './lint-command.js';

export async function lintWorkspace(): Promise<number> {
  return (await runLintCommand()).exitCode;
}
