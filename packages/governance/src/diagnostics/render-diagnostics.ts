// packages/governance/src/diagnostics/render-diagnostics.ts

import type { Diagnostic } from '../types/diagnostic.js';

export function renderDiagnostics(diagnostics: Diagnostic[]): void {
  if (diagnostics.length === 0) {
    console.log('✓ workspace validation passed');

    return;
  }

  for (const diagnostic of diagnostics) {
    console.log('');

    console.log(`${diagnostic.severity.toUpperCase()} ${diagnostic.code}`);

    console.log(diagnostic.message);

    if (diagnostic.location?.file) {
      console.log(`File: ${diagnostic.location.file}`);
    }

    if (diagnostic.hint) {
      console.log(`Hint: ${diagnostic.hint}`);
    }
  }
}
