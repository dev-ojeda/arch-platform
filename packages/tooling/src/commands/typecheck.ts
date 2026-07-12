// packages/tooling/src/commands/typecheck.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runTask } from '../runtime/task/run-task.js';

import type { TypecheckCommandOptions } from './command-options.js';
import { runTypecheckCommand } from './typecheck/typecheck-command.js';

export async function typecheckCommand(options: TypecheckCommandOptions = {}): Promise<number> {
  return runTask({
    events: ToolingEvents.typecheck,
    action: () => runTypecheckCommand(options),
  });
}
