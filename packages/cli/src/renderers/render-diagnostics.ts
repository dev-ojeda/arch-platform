// packages/cli/src/renderers/render-diagnostics.ts

import type { GovernanceScope } from '@arch/governance';
import type { Diagnostic } from '@arch/platform-model';

import { formatterDiagnostic } from './formatter-diagnostic.js';

export function renderDiagnostics(diagnostics: Diagnostic[], scope: GovernanceScope): void {
  if (diagnostics.length === 0) {
    console.log(getSuccessMessage(scope));
    return;
  }

  for (const diagnostic of diagnostics) {
    console.log(formatterDiagnostic(diagnostic));
  }
}

function getSuccessMessage(scope: GovernanceScope): string {
  switch (scope.kind) {
    case 'package':
      return `✓ package validation passed: ${scope.packageName}`;

    case 'workspace':
      return '✓ workspace validation passed';

    case 'changed':
      return '✓ changed packages validation passed';
  }
}
