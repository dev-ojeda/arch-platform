// packages/tooling/src/commands/common/command-result.ts

import type { ExecuteCommandResult } from '../../runtime/execution/execute-command-result.js';

export interface CommandResult {
  readonly bundle: ExecuteCommandResult;

  readonly declarations: ExecuteCommandResult;

  readonly durationMs: number;

  readonly failed: boolean;

  readonly skipped: boolean;
}
