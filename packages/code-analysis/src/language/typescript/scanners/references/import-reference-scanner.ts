// packages/code-analysis/src/language/typescript/scanners/references/import-reference-scanner.ts

import type { SymbolEdge } from '../../../../graph/model/symbol-edge.js';
import type { SourceUnit } from '../../source/source-unit.js';
import type { ReferenceScanner } from '../reference-scanner.js';

export class ImportReferenceScanner implements ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const declaration of source.getImports()) {
      for (const { symbolId } of declaration.symbols) {
        if (!symbolId) {
          continue;
        }

        edges.push({
          from: source.path,
          to: symbolId,
          type: 'import',
        });
      }
    }

    return edges;
  }
}
