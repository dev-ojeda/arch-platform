// packages/tooling/src/commands/clean.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runTask } from '../runtime/task/run-task.js';

import { runCleanCommand } from './clean/clean-command.js';
import type { CleanCommandOptions } from './command-options.js';

export async function cleanCommand(options: CleanCommandOptions = {}): Promise<number> {
  return await runTask({
    events: ToolingEvents.clean,
    action: () => runCleanCommand(options),
  });
}
