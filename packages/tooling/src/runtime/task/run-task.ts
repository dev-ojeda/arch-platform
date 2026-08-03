// packages/tooling/src/runtime/task/run-task.ts

import { logger } from '../../logging/logger.js';

import type { RunTaskOptions } from './run-task-options.js';
import type { TaskResult } from './task-result.js';

/**
 * Executes a tooling task with lifecycle tracking and error handling.
 *
 * Responsibilities:
 * - Execute the task action.
 * - Capture unexpected failures.
 * - Emit tooling lifecycle events.
 * - Return a CLI-compatible exit code.
 */
export async function runTask<TResult extends TaskResult>(
  options: RunTaskOptions<TResult>,
): Promise<number> {
  try {
    const result = await options.action();
    switch (result.status) {
      case 'completed':
        return 0;

      case 'skipped':
        return 0;

      case 'failed':
        return 1;
    }
  } catch (error) {
    logger.error(options.task.events.failed, {
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
