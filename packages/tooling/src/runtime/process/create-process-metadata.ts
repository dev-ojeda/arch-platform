// packages/tooling/src/runtime/process/create-process-metadata.ts

import { formatBytes } from '../../utils/format-bytes.js';
import { formatDuration } from '../../utils/format-duration.js';

import type {
  ExecutionMetadata,
  ExecutionMetadataOptions,
} from '../execution/execution-metadata.js';

export function createProcessMetadata(options: ExecutionMetadataOptions): ExecutionMetadata {
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
