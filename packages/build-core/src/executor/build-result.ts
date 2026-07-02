// packages/build-core/src/executor/build-result.ts

import type { CacheAction, CacheDecision, ChangeReason } from '../cache/cache-types.js';

import type { ExecutionReason } from './execution-types.js';

export type BuildResult = {
  package: string;

  status: 'success' | 'failed' | 'skipped';

  changeReason: ChangeReason;

  execution: {
    reason: ExecutionReason;
  };

  cache: {
    decision: CacheDecision;
    action: CacheAction;
  };

  meta?: {
    durationMs?: number;
    command?: string;
    exitCode?: number;
  };
};
