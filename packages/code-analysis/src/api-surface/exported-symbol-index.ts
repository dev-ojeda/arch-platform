// packages\code-analysis\src\api-surface\exported-symbol-index.ts

import type { ExportedSymbol } from './model/exported-symbol.js';

export interface ExportedSymbolIndex {
  has(symbolId: string): boolean;

  get(symbolId: string): ExportedSymbol | undefined;
}
