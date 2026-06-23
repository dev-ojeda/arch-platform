// packages/governance/src/engine/governance-engine-result.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';

export interface GovernanceEngineResult {
  readonly success: boolean;

  readonly diagnostics: readonly Diagnostic[];

  readonly durationMs: number;

  readonly evaluatedRules: number;
}
