import type { CacheDecision, ChangeReason } from '../cache/cache-types.js';
import type { HashResult } from '../hash/hash-result.js';

export type BuildAction = 'execute' | 'restore' | 'skip';

export interface BuildPlanEntry {
  package: string;

  /**
   * Acción planificada por el ChangePlanner.
   */
  buildAction: BuildAction;

  /**
   * Resultado de la evaluación de caché.
   * Se conserva para diagnóstico.
   */
  cache: {
    decision: CacheDecision;
  };

  /**
   * Motivo del cambio detectado.
   */
  changeReason: ChangeReason;

  /**
   * Hash evaluado para esta planificación.
   * Será persistido si la ejecución finaliza correctamente.
   */
  hash: HashResult;
}
