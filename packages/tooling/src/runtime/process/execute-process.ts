// packages/tooling/src/runtime/process/execute-process.ts

import { execa, ExecaError } from 'execa';

import { logger } from '../../logging/logger.js';
import { normalizeOutput } from '../../serialization/normalize-output.js';
import { formatCommand } from '../../utils/format-command.js';
import { RuntimeEvents } from '../events/runtime-event.js';


import { createExecaOptions } from './create-execa-options.js';
import { createProcessMetadata } from './create-process-metadata.js';
import { createProcessResult } from './create-process-result.js';
import { createStopwatch } from './create-stopwatch.js';

import type { ExecuteCommandOptions } from '../execution/execute-command-option.js';
import type { ExecuteCommandResult } from '../execution/execute-command-result.js';
import type { ExecutionMetadata } from '../execution/execution-metadata.js';

function logCommandStarted(
  commandContext: {
    readonly command: string;
    readonly args: readonly string[];
    readonly commandLine: string;
    readonly cwd?: string;
  },
  options: ExecuteCommandOptions,
): void {
  logger.info(RuntimeEvents.command.started, {
    metadata: {
      ...commandContext,
      shell: options.shell,
    },
  });
}

function logCommandFinished(metadata: ExecutionMetadata): void {
  if (metadata.exitCode === 0) {
    logger.success(RuntimeEvents.command.completed, {
      metadata,
    });

    return;
  }

  logger.error(RuntimeEvents.command.failed, {
    metadata,
  });
}

export async function executeProcess(
  command: string,
  args: string[] = [],
  options: ExecuteCommandOptions = {},
): Promise<ExecuteCommandResult> {
  const commandContext = {
    command,
    args,
    commandLine: formatCommand(command, args),
    cwd: options.cwd,
  } as const;
  const stopwatch = createStopwatch();

  logCommandStarted(commandContext, options);

  try {
    const result = await execa(command, args, createExecaOptions(options));

    const durationMs = stopwatch.elapsed();

    const stdout = normalizeOutput(result.stdout);

    const stderr = normalizeOutput(result.stderr);

    const metadata = createProcessMetadata({
      ...commandContext,
      exitCode: result.exitCode ?? 0,
      durationMs,
      signal: result.signal,
      stdout,
      stderr,
    });

    logCommandFinished(metadata);

    return createProcessResult({
      ...commandContext,
      exitCode: metadata.exitCode,
      stdout,
      stderr,
      durationMs,
      signal: result.signal,
    });
  } catch (error) {
    if (error instanceof ExecaError) {
      logger.error(RuntimeEvents.command.crashed, {
        metadata: {
          ...commandContext,
          exitCode: error.exitCode,
          signal: error.signal,
          stdout: error.stdout,
          stderr: error.stderr,
        },
      });

      throw error;
    }

    logger.error(RuntimeEvents.command.crashed, {
      metadata: {
        ...commandContext,
        error: String(error),
      },
    });

    throw error;
  }
}
