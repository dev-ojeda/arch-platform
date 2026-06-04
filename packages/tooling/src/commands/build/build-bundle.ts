// packages/tooling/src/commands/build/build-bundle.ts
import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { executeCommand } from '../../runtime/execute-command.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { formatDuration } from '../../utils/format-duration.js';
import { logger } from '../../utils/logger.js';

export async function buildBundle(
  configPath: string,
  args: readonly string[] = [],
): Promise<ExecuteCommandResult> {
  logger.info(ToolingEvents.buildBundle.started, {
    metadata: {
      configPath,
      args,
    },
  });
  const result = await executeCommand('tsup', ['--config', configPath, ...args]);

  if (result.failed) {
    logger.error(ToolingEvents.buildBundle.failed, {
      metadata: {
        exitCode: result.exitCode,
        duration: formatDuration(result.durationMs),
      },
    });

    return result;
  }

  logger.success(ToolingEvents.buildBundle.completed, {
    metadata: {
      exitCode: result.exitCode,
      duration: formatDuration(result.durationMs),
    },
  });

  return result;
}
