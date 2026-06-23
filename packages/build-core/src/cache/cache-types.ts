// packages\build-core\src\cache\cache-types.ts

import type { ExecutionReason } from '../executor/execution-types.js';

export type ChangeReason =
  | 'none'
  | 'source'
  | 'dependency'
  | 'first-build'
  | 'cache-version'
  | 'config'
  | 'dependency_failed'
  | 'missing-output';
export type CacheDecision = 'hit' | 'miss' | 'stale' | 'restore' | 'invalid';

export type BuildResult = {
  package: string;
  status: 'success' | 'failed' | 'skipped';
  changeReason: ChangeReason;
  executionReason: ExecutionReason;
  cacheDecision: CacheDecision;
  meta?: {
    exitCode?: number;
    durationMs?: number;
    step?: string;
    command?: string;
  };
};
