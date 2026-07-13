// packages/tooling/src/commands/typecheck/typecheck.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { runTask } from '../../runtime/task/run-task.js';
import type { TypecheckCommandOptions } from '../common/command-options.js';

import { runTypecheckCommand } from './run.js';

export async function typecheckCommand(options: TypecheckCommandOptions = {}): Promise<number> {
  return runTask({
    events: ToolingEvents.typecheck,
    action: () => runTypecheckCommand(options),
  });
}
