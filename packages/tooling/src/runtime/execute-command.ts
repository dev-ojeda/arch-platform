// packages/tooling/src/runtime/execute-command.ts

import { execa, ExecaError } from 'execa';

import { formatCommand } from '../utils/format-command.js';
import { logger } from '../utils/logger.js';

import { RuntimeEvents } from './events/runtime-event.js';
import type { ExecuteCommandOptions } from './execution/execute-command-option.js';
import type { ExecuteCommandResult } from './execution/execute-command-result.js';
import type { ExecutionMetadata } from './execution/execution-metadata.js';
import { createCommandResult } from './helpers/create-command-result.js';
import { createExecaOptions } from './helpers/create-execa-options.js';
import { createExecutionMetadata } from './helpers/create-execution-metadata.js';
import { createStopwatch } from './helpers/create-stopwatch.js';
import { normalizeOutput } from './helpers/normalize-output.js';

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

export async function executeCommand(
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

    const metadata = createExecutionMetadata({
      ...commandContext,
      exitCode: result.exitCode ?? 0,
      durationMs,
      signal: result.signal,
      stdout,
      stderr,
    });

    logCommandFinished(metadata);

    return createCommandResult({
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
