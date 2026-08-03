// packages/governance/src/public/governance-rule-result.ts

import type { DiagnosticSeverity } from '@arch/platform-model';

import type { GovernanceRuleId } from '../engine/governance-rule-id.js';

export interface GovernanceRuleResult {
  readonly rule: GovernanceRuleId;

  readonly name: string;

  readonly success: boolean;

  readonly durationMs: number;

  readonly diagnosticCount: number;

  readonly severity: DiagnosticSeverity;

  readonly error?: string;
}
