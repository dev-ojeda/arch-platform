// packages/build-core/src/planning/plan-entry.ts

import type { CacheAction, CacheDecision, ChangeReason } from '../cache/cache-types.js';
import type { HashResult } from '../hash/hash-result.js';

export interface BuildPlanEntry {
  package: string;

  /**
   * El scheduler decide si entra a ejecución
   */
  shouldExecute: boolean;

  /**
   * Resultado de evaluación de cache
   */
  cache: {
    decision: CacheDecision;
    action: CacheAction;
  };

  /**
   * Motivo del cambio detectado
   */
  changeReason: ChangeReason;

  /**
   * Hash evaluado para esta planificación.
   * Será persistido si la ejecución finaliza correctamente.
   */
  hash: HashResult;
}
