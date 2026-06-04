// packages/tooling/src/commands/build/build-declarations.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { executeCommand } from '../../runtime/execute-command.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { formatDuration } from '../../utils/format-duration.js';
import { logger } from '../../utils/logger.js';

export async function buildDeclarations(tsconfigPath: string): Promise<ExecuteCommandResult> {
  logger.info(ToolingEvents.buildTypes.started, {
    metadata: {
      tsconfigPath,
    },
  });

  const result = await executeCommand('tsc', ['-p', tsconfigPath, '--emitDeclarationOnly']);

  if (result.failed) {
    logger.error(ToolingEvents.buildTypes.failed, {
      metadata: {
        exitCode: result.exitCode,
        duration: formatDuration(result.durationMs),
      },
    });

    return result;
  }

  logger.success(ToolingEvents.buildTypes.completed, {
    metadata: {
      exitCode: result.exitCode,
      duration: formatDuration(result.durationMs),
    },
  });

  return result;
}
