// packages\tooling\src\runtime\execution\execution-metadata-options.ts

import type { ExecuteCommandResult } from './execute-command-result.js';

export interface ExecutionMetadataOptions extends Pick<
  ExecuteCommandResult,
  'command' | 'args' | 'commandLine' | 'cwd' | 'exitCode' | 'durationMs' | 'signal'
> {
  readonly stdout: string;

  readonly stderr: string;
}
