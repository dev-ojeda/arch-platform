// packages/tooling/src/commands/pack/pack.ts

import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { runTask } from '../../runtime/task/run-task.js';
import type { PackCommandOptions } from '../common/command-options.js';

import { runPackCommand } from './run.js';

export async function packCommand(options: PackCommandOptions): Promise<number> {
  return runTask({
    task: ToolingTasks.pack,
    action: () => runPackCommand(options),
  });
}
