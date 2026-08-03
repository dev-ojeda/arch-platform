// packages/tooling/src/commands/common/command-result.ts

import type { ExecuteProcessResult } from '../../runtime/execution/execute-process-result.js';

export interface CommandResult {
  readonly bundle: ExecuteProcessResult;

  readonly declarations: ExecuteProcessResult;

  readonly durationMs: number;

  readonly failed: boolean;

  readonly skipped: boolean;
}
