// packages/code-analysis/src/public/exported-symbol-index.ts

import type { ExportedSymbol } from './exported-symbol.js';

export interface ExportedSymbolIndex {
  has(symbolId: string): boolean;

  get(symbolId: string): ExportedSymbol | undefined;

  getAll(): readonly ExportedSymbol[];

  findPublicExport(packageName: string, exportedName: string): readonly ExportedSymbol[];

  isPublicExport(packageName: string, exportedName: string): boolean;
}
