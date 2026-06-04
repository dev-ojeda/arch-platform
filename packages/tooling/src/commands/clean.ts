// packages/tooling/src/commands/clean.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runCommand } from '../runtime/run-command.js';

import { cleanWorkspace } from './clean/clean-workspace.js';

export async function cleanCommand(): Promise<void> {
  process.exitCode = await runCommand({
    events: ToolingEvents.clean,
    action: cleanWorkspace,
  });
}
