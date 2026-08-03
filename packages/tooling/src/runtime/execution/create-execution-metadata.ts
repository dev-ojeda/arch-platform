// packages/tooling/src/runtime/execution/create-execution-metadata.ts

import { formatBytes } from '../../utils/format-bytes.js';
import { formatDuration } from '../../utils/format-duration.js';
import type { ExecutionMetadata, ExecutionMetadataInput } from '../execution/execution-metadata.js';

export function createExecutionMetadata(options: ExecutionMetadataInput): ExecutionMetadata {
  const { command, args, commandLine, cwd, exitCode, durationMs, signal, stdout, stderr } = options;

  return {
    command,
    args,
    commandLine,
    cwd,
    durationMs,
    duration: formatDuration(durationMs),
    exitCode,
    signal,
    stdoutSize: stdout ? formatBytes(stdout.length) : undefined,
    stderrSize: stderr ? formatBytes(stderr.length) : undefined,
  };
}
