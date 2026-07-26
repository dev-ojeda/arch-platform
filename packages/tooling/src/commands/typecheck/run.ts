// packages/tooling/src/commands/typecheck/run.ts

import { pathExistsSync } from '@arch/infrastructure';

import { logger } from '../../logging/logger.js';
import { ToolingEvents } from '../../runtime/events/tooling-event.js';
import { executeProcess } from '../../runtime/process/execute-process.js';
import { createSkippedCommandResult } from '../common/create-skipped-command-result.js';
import { FileConfigNames } from '../config/config-file-name.js';

import { createTypecheckArguments } from './create-typecheck-arguments.js';

import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';
import type { TypecheckCommandOptions } from '../common/command-options.js';

export async function runTypecheckCommand(
  options: TypecheckCommandOptions = {},
): Promise<ExecuteCommandResult> {
  const { configPath = FileConfigNames.tsconfig, noEmit = true, args = [] } = options;
  console.log('runTypecheckCommand');
  if (!pathExistsSync(configPath)) {
    logger.warn(ToolingEvents.typecheck.skipped, {
      metadata: {
        reason: `Missing ${configPath}`,
        configPath,
      },
    });

    return createSkippedCommandResult(ToolingEvents.typecheck.skipped);
  }

  return executeProcess('tsc', createTypecheckArguments(configPath, noEmit, args));
}
