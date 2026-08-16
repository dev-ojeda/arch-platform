// packages/code-analysis/src/api-surface/default-exported-symbol-index.ts

import type { ExportedSymbolIndex } from '../public/exported-symbol-index.js';
import type { ExportedSymbol } from '../public/exported-symbol.js';

export class DefaultExportedSymbolIndex implements ExportedSymbolIndex {
  constructor(
    private readonly symbols: ReadonlyMap<string, ExportedSymbol>,
    private readonly symbolsByPackage: ReadonlyMap<string, readonly ExportedSymbol[]>,
  ) {}

  has(symbolId: string): boolean {
    return this.symbols.has(symbolId);
  }

  get(symbolId: string): ExportedSymbol | undefined {
    return this.symbols.get(symbolId);
  }

  getAll(): readonly ExportedSymbol[] {
    return Array.from(this.symbols.values());
  }

  findPublicExport(packageName: string, exportedName: string): readonly ExportedSymbol[] {
    return (
      this.symbolsByPackage
        .get(packageName)
        ?.filter((symbol) => symbol.exportedName === exportedName) ?? []
    );
  }

  isPublicExport(packageName: string, exportedName: string): boolean {
    return this.findPublicExport(packageName, exportedName).length > 0;
  }
}
