// packages/governance/src/analysis/semantics/semantic-kind.ts

import type { RuntimeSymbolKind } from '@arch/code-analysis';

export function isRuntimeSymbolKind(value: unknown): value is RuntimeSymbolKind {
  return value === 'class' || value === 'function' || value === 'enum' || value === 'variable';
}
