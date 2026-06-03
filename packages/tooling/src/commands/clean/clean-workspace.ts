// packages/tooling/src/commands/clean/clean-workspace.ts

import { runCleanCommand } from './clean-command.js';

export async function cleanWorkspace(): Promise<number> {
  return await runCleanCommand();
}
