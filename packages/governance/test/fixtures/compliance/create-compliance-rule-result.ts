import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import type { ComplianceRule } from '../../../src/compliance/compliance-rule.js';

export function createComplianceRuleResult(
  diagnostics: readonly Diagnostic[] = [],
  changes: readonly ComplianceStateChange[] = [],
): ComplianceRule {
  return {
    id: 'artifact-compliance',
    name: 'artifact-compliance',

    supports: () => true,

    async run() {
      return {
        diagnostics,
        changes,
      };
    },
  };
}
