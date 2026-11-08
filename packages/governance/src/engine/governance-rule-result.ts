// packages/governance/src/public/governance-rule-result.ts

import type { DiagnosticSeverity } from '@arch-platform/platform-model';

import type { GovernanceRuleId } from './governance-rule-id.js';

export interface GovernanceRuleResult {
  readonly rule: GovernanceRuleId;

  readonly name: string;

  readonly success: boolean;

  readonly durationMs: number;

  readonly diagnosticCount: number;

  readonly severity: DiagnosticSeverity;

  readonly error?: string;
}
