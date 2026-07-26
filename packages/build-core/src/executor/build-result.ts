// packages/build-core/src/executor/build-result.ts

import type { ExecutionReason } from './execution-types.js';
import type { ChangeReason } from '../cache/cache-types.js';


export type BuildResult = {
  package: string;

  status: 'success' | 'failed' | 'skipped';

  changeReason: ChangeReason;

  execution: {
    reason: ExecutionReason;

    triggeredBy?: {
      package: string;
      reason: 'dependency-changed' | 'source-changed' | 'manual' | 'cache-invalidated';
    };
  };

  meta?: {
    durationMs?: number;
    command?: string;
    exitCode?: number;
  };
};
