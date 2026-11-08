// packages/tooling/src/commands/typecheck/typecheck.ts

import { runTypecheckCommand } from './run.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { runTask } from '../../runtime/task/run-task.js';
import type { TypecheckCommandOptions } from '../common/command-options.js';


export async function typecheckCommand(options: TypecheckCommandOptions = {}): Promise<number> {
  return runTask({
    task: ToolingTasks.typecheck,
    action: () => runTypecheckCommand(options),
  });
}
