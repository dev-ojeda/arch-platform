// packages/tooling/src/commands/lint/lint.ts

import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { runTask } from '../../runtime/task/run-task.js';
import type { LintCommandOptions } from '../common/command-options.js';

import { runLintCommand } from './run.js';

export async function lintCommand(options: LintCommandOptions = {}): Promise<number> {
  return runTask({
    task: ToolingTasks.lint,
    action: () => runLintCommand(options),
  });
}
