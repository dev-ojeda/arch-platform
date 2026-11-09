// packages/build-core/src/executor/build-result.ts
import type { ExecutionReason } from './execution-types.js';
import type { ChangeReason } from '../cache/cache-types.js';
import type { ExecutionTriggerReason } from '../runtime/execution/execution-context.js';


export type BuildResult = {
  package: string;

  status: 'success' | 'failed' | 'skipped';

  changeReason: ChangeReason;

  execution: {
    reason: ExecutionReason;

    triggeredBy?: {
      package: string;
      reason: ExecutionTriggerReason;
    };
  };

  meta?: {
    durationMs?: number;
    command?: string;
    exitCode?: number;
  };
};
