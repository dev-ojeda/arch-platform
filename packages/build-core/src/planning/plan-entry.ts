// packages/build-core/src/planning/plan-entry.ts

import type { CacheDecision, ChangeReason } from '../cache/cache-types.js';
import type { ExecutionReason } from '../executor/execution-types.js';
import type { HashResult } from '../hash/hash-result.js';

export interface BuildPlanEntry {
  package: string;

  /**
   * El scheduler decide si entra a ejecución
   */
  shouldExecute: boolean;

  /**
   * Qué pasó con cache
   */
  cacheDecision: CacheDecision;

  /**
   * Por qué cambió
   */
  changeReason: ChangeReason;

  /**
   * Por qué se ejecuta
   */
  executionReason: ExecutionReason;

  /**
   * Hash evaluado para esta planificación.
   * Será persistido si la ejecución finaliza correctamente.
   */
  hash: HashResult;
}
