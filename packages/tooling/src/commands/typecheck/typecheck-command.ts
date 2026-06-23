// packages/tooling/src/commands/typecheck/typecheck-command.ts

import { logger } from '../../logging/logger.js';
import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { executeCommand } from '../../runtime/execute-command.js';
import { createSkippedCommandResult } from '../../runtime/execution/create-skipped-command-result.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { fileExists } from '../../utils/file-exists.js';
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

  return executeCommand('tsc', ['-b', configPath]);
}
