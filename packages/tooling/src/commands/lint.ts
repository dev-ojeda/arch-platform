// packages\tooling\src\commands\lint.ts

import { ToolingEvents } from '../runtime/events/tooling-event.js';
import { runTask } from '../runtime/task/run-task.js';

import type { LintCommandOptions } from './command-options.js';
import { runLintCommand } from './lint/lint-command.js';

export async function lintCommand(options: LintCommandOptions = {}): Promise<number> {
  return runTask({
    events: ToolingEvents.lint,
    action: () => runLintCommand(options),
  });
}
