// packages/code-analysis/src/language/typescript/scanners/references/import-reference-scanner.ts

import type { SymbolEdge } from '../../../../public/symbol-edge.js';
import type { SourceUnit } from '../../source/source-unit.js';
import type { ReferenceScanner } from '../reference-scanner.js';

export class ImportReferenceScanner implements ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const imported of source.getImports()) {
      for (const symbol of imported.symbols) {
        if (!symbol.symbolId) {
          continue;
        }

        edges.push({
          from: source.path,
          to: symbol.symbolId,
          type: 'import',
          metadata: {
            kind: symbol.kind,
            moduleSpecifier: imported.moduleSpecifier,
            resolvedFile: imported.resolvedFile,
            isTypeOnly: imported.isTypeOnly || symbol.isTypeOnlyImport,
          },
        });
      }
    }

    return edges;
  }
}
