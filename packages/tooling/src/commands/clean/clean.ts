// packages/tooling/src/commands/clean/clean.ts

import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { runTask } from '../../runtime/task/run-task.js';
import type { CleanCommandOptions } from '../common/command-options.js';

import { runCleanCommand } from './run.js';

export async function cleanCommand(options: CleanCommandOptions = {}): Promise<number> {
  return await runTask({
    task: ToolingTasks.clean,
    action: () => runCleanCommand(options),
    emitCompletedEvent: false,
  });
}
