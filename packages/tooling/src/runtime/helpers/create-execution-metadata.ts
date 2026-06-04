// packages/tooling/src/runtime/helpers/create-execution-metadata.ts

import { formatBytes } from '../../utils/format-bytes.js';
import { formatDuration } from '../../utils/format-duration.js';
import type { ExecutionMetadataOptions } from '../execution/execution-metadata-options.js';
import type { ExecutionMetadata } from '../execution/execution-metadata.js';

export function createExecutionMetadata(options: ExecutionMetadataOptions): ExecutionMetadata {
  const { command, args, commandLine, cwd, exitCode, durationMs, signal, stdout, stderr } = options;

  return {
    command,
    args,
    commandLine,

    cwd,

    exitCode,

    durationMs,

    duration: formatDuration(durationMs),

    signal,

    terminated: signal !== undefined,

    stdoutSize: formatBytes(Buffer.byteLength(stdout)),

    stderrSize: formatBytes(Buffer.byteLength(stderr)),
  };
}
