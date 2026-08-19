// packages/tooling/src/runtime/process/execute-process.ts

import { execa, ExecaError } from 'execa';

import { normalizeOutput } from '../../serialization/normalize-output.js';
import { formatCommand } from '../../utils/format-command.js';
import type { ExecuteProcessOptions } from '../execution/execute-process-option.js';
import type { ExecuteProcessResult } from '../execution/execute-process-result.js';

import { createExecaOptions } from './create-execa-options.js';
import { createProcessResult } from './create-process-result.js';
import { createStopwatch } from './create-stopwatch.js';

export async function executeProcess(
  command: string,
  args: readonly string[] = [],
  options: ExecuteProcessOptions = {},
): Promise<ExecuteProcessResult> {
  const processContext = {
    command,
    commandLine: formatCommand(command, args),
  } as const;

  const stopwatch = createStopwatch();

  const createResult = (
    exitCode: number,
    cwd: string,
    stdout: string,
    stderr: string,
    signal?: NodeJS.Signals,
  ) =>
    createProcessResult({
      ...processContext,
      args,
      exitCode,
      stdout,
      stderr,
      cwd,
      durationMs: stopwatch.elapsed(),
      signal,
    });
  const execaOptions = createExecaOptions(options);

  try {
    const result = await execa(command, args, execaOptions);
    return createResult(
      result.exitCode ?? 0,
      normalizeOutput(result.cwd),
      normalizeOutput(result.stdout),
      normalizeOutput(result.stderr),
      result.signal,
    );
  } catch (error) {
    if (error instanceof ExecaError) {
      return createResult(
        error.exitCode ?? 1,
        normalizeOutput(error.cwd),
        normalizeOutput(error.stdout),
        normalizeOutput(error.stderr),
        error.signal,
      );
    }

    throw error;
  }
}
