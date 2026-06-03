// packages/tooling/src/commands/dev/dev-workspace.ts

import { runDevCommand } from './dev-command.js';

export async function devWorkspace(): Promise<number> {
  return runDevCommand();
}
