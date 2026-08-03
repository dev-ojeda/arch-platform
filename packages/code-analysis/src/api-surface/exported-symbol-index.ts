// packages\code-analysis\src\api-surface\exported-symbol-index.ts

import type { ExportedSymbolInfo } from './model/exported-symbol-info.js';

export interface ExportedSymbolIndex {
  has(symbolId: string): boolean;

  get(symbolId: string): ExportedSymbolInfo | undefined;

  getAll(): readonly ExportedSymbolInfo[];
}
