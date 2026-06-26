// packages/governance/src/diagnostics/diagnostic-formatter.ts

import type { Diagnostic } from '../types/diagnostic.js';

export function formatDiagnostic(diagnostic: Diagnostic): string {
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
