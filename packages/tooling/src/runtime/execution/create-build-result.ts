// packages/tooling/src/runtime/execution/create-build-result.ts

import type { BuildResult } from './build-result.js';
import type { ExecuteCommandResult } from './execute-command-result.js';

export interface CreateBuildResultOptions {
  readonly bundle: ExecuteCommandResult;

  readonly declarations: ExecuteCommandResult;

  readonly durationMs: number;
}

export function createBuildResult(options: CreateBuildResultOptions): BuildResult {
  const failed = options.bundle.failed || options.declarations.failed;

  const skipped = Boolean(options.bundle.skipped) && Boolean(options.declarations.skipped);

  return {
    bundle: options.bundle,
    declarations: options.declarations,
    durationMs: options.durationMs,
    failed,
    skipped,
  };
}
