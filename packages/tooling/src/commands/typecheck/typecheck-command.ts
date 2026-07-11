// packages/tooling/src/commands/typecheck/typecheck-command.ts

import { logger } from '../../logging/logger.js';
import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { fileExists } from '../../utils/file-exists.js';
import type { TypecheckCommandOptions } from '../command-options.js';
import { createSkippedCommandResult } from '../common/create-skipped-command-result.js';
import { FileConfigNames } from '../config/config-file-name.js';

export async function runTypecheckCommand(
  options: TypecheckCommandOptions,
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

  return executeProcess('tsc', ['-b', configPath]);
}
