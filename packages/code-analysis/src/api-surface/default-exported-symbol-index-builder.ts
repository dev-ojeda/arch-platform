// packages/code-analysis/src/api-surface/default-exported-symbol-index-builder.ts

import type { SourceReader } from '../language/typescript/source/source-reader.js';

import { DefaultExportedSymbolIndex } from './default-exported-symbol-index.js';
import type { ExportedSymbolIndexBuilder } from './exported-symbol-index-builder.js';
import type { ExportedSymbolIndex } from './exported-symbol-index.js';
import type { ExportedSymbolInfo } from './model/exported-symbol-info.js';

export class DefaultExportedSymbolIndexBuilder implements ExportedSymbolIndexBuilder {
  build(sourceReader: SourceReader): ExportedSymbolIndex {
    const symbols = new Map<string, ExportedSymbolInfo>();

    for (const source of sourceReader.getSources()) {
      for (const exported of source.getExports()) {
        for (const symbol of exported.symbols) {
          symbols.set(symbol.id, {
            symbol,
            kind: exported.kind,
            moduleSpecifier: exported.moduleSpecifier,
          });
        }
      }
    }

    return new DefaultExportedSymbolIndex(symbols);
  }
}
