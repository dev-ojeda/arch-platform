// packages/code-analysis/src/api-surface/default-exported-symbol-index.ts

import type { ExportedSymbolIndex } from './exported-symbol-index.js';
import type { ExportedSymbolInfo } from './model/exported-symbol-info.js';

export class DefaultExportedSymbolIndex implements ExportedSymbolIndex {
  constructor(private readonly symbols: ReadonlyMap<string, ExportedSymbolInfo>) {}

  has(symbolId: string): boolean {
    return this.symbols.has(symbolId);
  }

  get(symbolId: string): ExportedSymbolInfo | undefined {
    return this.symbols.get(symbolId);
  }

  getAll(): readonly ExportedSymbolInfo[] {
    return Array.from(this.symbols.values());
  }
}
