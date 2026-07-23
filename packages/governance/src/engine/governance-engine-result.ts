// packages/governance/src/engine/governance-engine-result.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceRuleExecution } from './governance-rule-execution.js';

export interface GovernanceEngineResult {
  readonly success: boolean;

  readonly diagnostics: readonly Diagnostic[];

  readonly durationMs: number;

  readonly evaluatedRules: number;

  readonly executions: readonly GovernanceRuleExecution[];
}
