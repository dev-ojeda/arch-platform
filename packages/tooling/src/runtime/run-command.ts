// packages/tooling/src/runtime/run-command.ts

import { logger } from '../logging/logger.js';

import type { ToolingTaskEvents } from './events/tooling-task-events.js';

export interface RunCommandOptions {
  readonly events: ToolingTaskEvents;

  readonly action: () => Promise<number>;
}
function logResult(exitCode: number, events: ToolingTaskEvents): void {
  const metadata = { exitCode };

  if (exitCode === 0) {
    logger.success(events.completed, { metadata });
    return;
  }

  logger.error(events.failed, { metadata });
}
export async function runCommand(options: RunCommandOptions): Promise<number> {
  try {
    const exitCode = await options.action();
    logResult(exitCode, options.events);
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
