// packages/tooling/src/runtime/execution/execution-metadata.ts

import type { ExecuteProcessResult } from './execute-process-result.js';

export interface ExecutionMetadata extends Record<string, unknown> {
  readonly command: string;
  readonly args?: readonly string[];
  readonly commandLine: string;
  readonly cwd?: string;
  readonly exitCode: number;
  readonly durationMs: number;
  readonly duration: string;
  readonly signal?: NodeJS.Signals;
  readonly terminated?: boolean;
  readonly stdoutSize?: string;
  readonly stderrSize?: string;
}
export interface ExecutionMetadataInput extends Pick<
  ExecuteProcessResult,
  'command' | 'args' | 'commandLine' | 'cwd' | 'exitCode' | 'durationMs' | 'signal'
> {
  readonly stdout: string;

  readonly stderr: string;
}
