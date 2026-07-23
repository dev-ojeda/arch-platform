// packages/governance/src/rules/execution-result-rule.ts

import type { Diagnostic } from '@arch/platform-model';

import type { GovernanceRule } from '../engine/governance-rule.js';

export interface RuleExecutionResult {
  rule: GovernanceRule;
  diagnostics: Diagnostic[];
  durationMs: number;
  error?: unknown;
}
