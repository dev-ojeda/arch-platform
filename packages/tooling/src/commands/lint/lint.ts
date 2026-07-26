// packages/tooling/src/commands/lint/lint.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { runTask } from '../../runtime/task/run-task.js';

import { runLintCommand } from './run.js';

import type { LintCommandOptions } from '../common/command-options.js';


export async function lintCommand(options: LintCommandOptions = {}): Promise<number> {
  return runTask({
    events: ToolingEvents.lint,
    action: () => runLintCommand(options),
  });
}
