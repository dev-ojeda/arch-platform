// packages/code-analysis/src/api-surface/default-exported-symbol-index-builder.ts

import type { SourceReader } from '../language/typescript/source/source-reader.js';
import type { PackageResolver } from '../package/resolvers/package-resolver.js';
import type { ExportedSymbolIndex } from '../public/exported-symbol-index.js';
import type { ExportedSymbol } from '../public/exported-symbol.js';

import { DefaultExportedSymbolIndex } from './default-exported-symbol-index.js';
import type { ExportedSymbolIndexBuilder } from './exported-symbol-index-builder.js';

export class DefaultExportedSymbolIndexBuilder implements ExportedSymbolIndexBuilder {
  build(sourceReader: SourceReader, packageResolver: PackageResolver): ExportedSymbolIndex {
    const symbols = new Map<string, ExportedSymbol>();
    const symbolsByPackage = new Map<string, ExportedSymbol[]>();

    for (const source of sourceReader.getSources()) {
      const packageName = packageResolver.resolveFromFile(source.path);

      if (!packageName) {
        continue;
      }

      for (const exported of source.getExports()) {
        for (const symbol of exported.symbols) {
          const isTypeOnlyExport = exported.isTypeOnlyDeclaration || symbol.isTypeOnlyExport;

          const previous = symbols.get(symbol.id);

          const normalized: ExportedSymbol = previous
            ? {
                ...previous,
                isTypeOnlyExport: previous.isTypeOnlyExport || isTypeOnlyExport,
              }
            : {
                ...symbol,
                isTypeOnlyExport,
              };

          symbols.set(symbol.id, normalized);

          const packageSymbols = symbolsByPackage.get(packageName) ?? [];

          // Evitamos duplicar el mismo symbolId.
          if (!packageSymbols.some((item) => item.id === symbol.id)) {
            packageSymbols.push(normalized);
          }

          symbolsByPackage.set(packageName, packageSymbols);
        }
      }
    }

    return new DefaultExportedSymbolIndex(symbols, symbolsByPackage);
  }
}
