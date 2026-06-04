// packages/tooling/src/runtime/execution/build-result.ts

import type { ExecuteCommandResult } from './execute-command-result.js';

export interface BuildResult {
  readonly bundle: ExecuteCommandResult;

  readonly declarations: ExecuteCommandResult;

  readonly durationMs: number;

  readonly failed: boolean;

  readonly skipped: boolean;
}
