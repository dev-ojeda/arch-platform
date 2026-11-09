// packages/tooling/src/commands/lint/run.ts

import { createLintArguments } from './create-lint-arguments.js';
import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createProcessTaskResult } from '../../runtime/task/create-process-task-result.js';
import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';
import type { LintCommandOptions } from '../common/command-options.js';
import { createSkippedCommandResult } from '../common/create-skipped-command-result.js';

export async function runLintCommand(options: LintCommandOptions = {}): Promise<TaskProcessResult> {
  const { args = [], targets = [], maxWarnings = 0 } = options;

  if (targets.length === 0) {
    return createSkippedCommandResult();
  }

  const optimizedArgs = args.includes('--cache')
    ? args
    : [...args, '--cache', '--cache-strategy', 'content'];

  const lintArguments = createLintArguments(targets, maxWarnings, optimizedArgs);

  const result = await executeProcess('eslint', lintArguments);

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
