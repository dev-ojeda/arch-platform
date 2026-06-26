// packages/governance/src/rules/execution-result-rule.ts

import type { GovernanceRule } from '../engine/governance-rule.js';
import type { Diagnostic } from '../types/diagnostic.js';

export interface RuleExecutionResult {
  rule: GovernanceRule;
  diagnostics: Diagnostic[];
  durationMs: number;
  error?: unknown;
}
