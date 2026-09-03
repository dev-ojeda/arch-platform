// packages/governance/src/diagnostics/resolved-compliance-action.ts

import type { ComplianceStateChange, Diagnostic } from '@arch/platform-model';

import type { ComplianceAction } from '../public/compliance-action.js';

export function resolveComplianceAction(
  changes: readonly ComplianceStateChange[],
  diagnostics: readonly Diagnostic[],
): ComplianceAction {
  const change = changes[0];

  if (change) {
    if (change.nextStatus === 'approved' && change.previousStatus === 'transition') {
      return 'approve';
    }

    if (change.nextStatus === 'transition' || change.previousStatus === undefined) {
      return 'evaluate';
    }
  }

  if (diagnostics.some((diagnostic) => diagnostic.severity === 'warning')) {
    return 'evaluate';
  }

  return 'none';
}
