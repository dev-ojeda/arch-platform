// packages/cli/src/renderers/formatter-diagnostic.ts

import type { Diagnostic } from '@arch/platform-model';

export function formatterDiagnostic(diagnostic: Diagnostic): string {
  const location = diagnostic.location?.file ? ` (${diagnostic.location.file})` : '';

  const source = diagnostic.source ? `${diagnostic.source} ` : '';

  const hint = diagnostic.hint ? `\n  Hint: ${diagnostic.hint}` : '';

  return (
    `[${diagnostic.severity.toUpperCase()}] ` +
    `${source}${diagnostic.code}${location} - ` +
    `${diagnostic.message}` +
    hint
  );
}
