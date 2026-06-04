// packages/tooling/src/commands/typecheck/typecheck-command.ts

import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { executeCommand } from '../../runtime/execute-command.js';
import { createSkippedCommandResult } from '../../runtime/execution/create-skipped-command-result.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { fileExists } from '../../utils/file-exists.js';
import { logger } from '../../utils/logger.js';
import { FileConfigNames } from '../config/config-file-name.js';

import type { TypecheckCommandOptions } from './typecheck-command-options.js';

export async function runTypecheckCommand(
  options: TypecheckCommandOptions = {},
): Promise<ExecuteCommandResult> {
  const { configPath = FileConfigNames.tsconfig, events = ToolingEvents.typecheck } = options;

  if (!fileExists(configPath)) {
    logger.warn(events.skipped, {
      metadata: {
        reason: `Missing ${configPath}`,
        configPath,
      },
    });

    return createSkippedCommandResult(events.skipped);
  }

  return executeCommand('tsc', ['-p', configPath, '--noEmit']);
}
