// packages/governance/src/engine/governance-rule-execution.ts

import type { DiagnosticSeverity } from '../types/diagnostic.js';

import type { GovernanceRuleId } from './governance-rule-id.js';

export interface GovernanceRuleExecution {
  rule: GovernanceRuleId;

  name: string;

  success: boolean;

  durationMs: number;

  diagnostics: number;

  severity: DiagnosticSeverity;

  error?: string;
}
