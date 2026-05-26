// packages/governance/src/engine/governance-engine-result.ts

import type { Diagnostic } from '../diagnostics/diagnostic.js';

export interface GovernanceEngineResult {
  success: boolean;

  diagnostics: Diagnostic[];

  durationMs: number;

  evaluatedRules: number;
}
