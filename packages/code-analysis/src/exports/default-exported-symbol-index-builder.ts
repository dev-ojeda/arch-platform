// packages/code-analysis/src/exports/default-exported-symbol-index-builder.ts


import { DefaultExportedSymbolIndex } from './default-exported-symbol-index.js';

import type { ExportedSymbolIndexBuilder } from './exported-symbol-index-builder.js';
import type { ExportedSymbolIndex } from './exported-symbol-index.js';
import type { ExportedSymbol } from './exported-symbol.js';
import type { Project } from 'ts-morph';

export class DefaultExportedSymbolIndexBuilder implements ExportedSymbolIndexBuilder {
  build(_project: Project): ExportedSymbolIndex {
    const symbols = new Map<string, ExportedSymbol>();

    // recorrer source files
    // detectar exports
    // agregar símbolos

    return new DefaultExportedSymbolIndex(symbols);
  }
}
