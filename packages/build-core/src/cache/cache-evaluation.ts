// packages/build-core/src/cache/cache-evaluation.ts

import type { CacheDecision, ChangeReason } from './cache-types.js';

export interface CacheEvaluation {
  decision: CacheDecision;
  changeReason: ChangeReason;
}
