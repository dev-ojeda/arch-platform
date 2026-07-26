// packages/code-analysis/src/exports/exported-symbol-index.ts

import type { ExportedSymbol } from './exported-symbol.js';

export interface ExportedSymbolIndex {
  has(symbolId: string): boolean;

  get(symbolId: string): ExportedSymbol | undefined;
}
