// packages/code-analysis/src/api-surface/default-exported-symbol-index.ts

import type { ExportedSymbol } from '../language/typescript/scanners/symbols/model/exported-symbol.js';

import type { ExportedSymbolIndex } from './exported-symbol-index.js';

export class DefaultExportedSymbolIndex implements ExportedSymbolIndex {
  constructor(private readonly symbols: ReadonlyMap<string, ExportedSymbol>) {}

  has(symbolId: string): boolean {
    return this.symbols.has(symbolId);
  }

  get(symbolId: string): ExportedSymbol | undefined {
    return this.symbols.get(symbolId);
  }
}
