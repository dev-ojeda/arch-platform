// packages/cli/src/renderers/render-diagnostics.ts

import type { Diagnostic } from '@arch/platform-model';

import { formatterDiagnostic } from './formatter-diagnostic.js';

export function renderDiagnostics(diagnostics: Diagnostic[]): void {
  if (diagnostics.length === 0) {
    console.log('✓ workspace validation passed');
    return;
  }

  for (const diagnostic of diagnostics) {
    console.log(formatterDiagnostic(diagnostic));
  }
}
