// packages/tooling/src/runtime/task/run-task.ts

import { logger } from '../../logging/logger.js';

import type { RunTaskOptions, TaskResult } from './run-task-options.js';

/**
 * Executes a tooling command with lifecycle tracking and error handling.
 *
 * Responsibilities:
 * - Execute the command action.
 * - Capture unexpected failures.
 * - Emit tooling lifecycle events.
 * - Return a process-compatible exit code.
 */
export async function runTask<TResult extends TaskResult>(
  options: RunTaskOptions<TResult>,
): Promise<number> {
  try {
    const result = await options.action();
    const exitCode = result.exitCode;

    return exitCode;
  } catch (error) {
    logger.error(options.events.failed, {
      metadata: {
        error:
          error instanceof Error
            ? {
                message: error.message,
                stack: error.stack,
              }
            : String(error),
      },
    });

    return 1;
  }
}
