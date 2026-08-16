// packages/governance/src/analysis/exports/exported-symbol-context.ts

import type { ExportedSymbolIndex } from '@arch/code-analysis';

export interface ExportedSymbolContext {
  readonly exportedSymbols: ExportedSymbolIndex;
}
