// packages/tooling/src/commands/lint/run.ts

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createProcessTaskResult } from '../../runtime/task/create-process-task-result.js';
import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';
import type { LintCommandOptions } from '../common/command-options.js';
import { createSkippedCommandResult } from '../common/create-skipped-command-result.js';

import { createLintArguments } from './create-lint-arguments.js';

export async function runLintCommand(options: LintCommandOptions = {}): Promise<TaskProcessResult> {
  const { args = [], targets = [], maxWarnings = 0 } = options;

  if (targets.length === 0) {
    return createSkippedCommandResult();
  }

  const result = await executeProcess('eslint', createLintArguments(targets, maxWarnings, args));
  logger.success(ToolingTasks.lint.events.completed, {
    metadata: {
      command: result.command,
      stderr: result.stderr,
      stdout: result.stdout,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
    },
  });
  return createProcessTaskResult(result);
}
