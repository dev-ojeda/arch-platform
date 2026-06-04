// packages/tooling/src/runtime/run-command.ts

import { logger } from '../utils/logger.js';

import type { ToolingTaskEvents } from './events/tooling-task-events.js';

export interface RunCommandOptions {
  readonly events: ToolingTaskEvents;

  readonly action: () => Promise<number>;
}

export async function runCommand(options: RunCommandOptions): Promise<number> {
  try {
    const exitCode = await options.action();

    if (exitCode === 0) {
      logger.success(options.events.completed, {
        metadata: {
          exitCode,
        },
      });
    } else {
      logger.error(options.events.failed, {
        metadata: {
          exitCode,
        },
      });
    }

    return exitCode;
  } catch (error) {
    logger.error(options.events.failed, {
      metadata: {
        error: error instanceof Error ? error.message : String(error),
      },
    });

    return 1;
  }
}
