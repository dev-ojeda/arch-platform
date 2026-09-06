// packages/governance/src/analysis/exports/exported-symbol-context.ts

import type { ExportedSymbolIndex } from '@arch-platform/code-analysis';

export interface ExportedSymbolContext {
  readonly exportedSymbols: ExportedSymbolIndex;
}
