// packages/tooling/src/commands/typecheck/run.ts

import { logger } from '../../logging/logger.js';
import { ToolingTasks } from '../../runtime/events/tooling-task-events.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createProcessTaskResult } from '../../runtime/task/create-process-task-result.js';
import type { TaskProcessResult } from '../../runtime/task/task-process-result.js';
import type { TypecheckCommandOptions } from '../common/command-options.js';
import { FileConfigNames } from '../config/config-file-name.js';

import { createTypecheckArguments } from './create-typecheck-arguments.js';

export async function runTypecheckCommand(
  options: TypecheckCommandOptions = {},
): Promise<TaskProcessResult> {
  const { configPath = FileConfigNames.tsconfig, noEmit = true, args = [] } = options;

  const result = await executeProcess('tsc', createTypecheckArguments(configPath, noEmit, args));
  logger.success(ToolingTasks.typecheck.events.completed, {
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
