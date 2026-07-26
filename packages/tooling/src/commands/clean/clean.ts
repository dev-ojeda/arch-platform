// packages/tooling/src/commands/clean/clean.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { runTask } from '../../runtime/task/run-task.js';

import { runCleanCommand } from './run.js';

import type { CleanCommandOptions } from '../common/command-options.js';


export async function cleanCommand(options: CleanCommandOptions = {}): Promise<number> {
  return await runTask({
    events: ToolingEvents.clean,
    action: () => runCleanCommand(options),
    emitCompletedEvent: false,
  });
}
