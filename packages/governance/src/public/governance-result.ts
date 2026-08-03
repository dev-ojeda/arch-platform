// packages/governance/src/public/governance-result.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceRuleResult } from '../engine/governance-rule-result.js';

import type { GovernanceScope } from './governance-scope.js';

export interface GovernanceResult {
  readonly success: boolean;

  readonly diagnostics: readonly Diagnostic[];

  readonly durationMs: number;

  readonly evaluatedRules: number;

  readonly executions: readonly GovernanceRuleResult[];

  readonly scope: GovernanceScope;
}
