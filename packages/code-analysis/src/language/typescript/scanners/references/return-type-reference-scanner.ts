// packages/code-analysis/src/language/typescript/scanners/references/return-type-reference-scanner.ts

import type { SymbolEdge } from '../../../../public/symbol-edge.js';
import type { SourceUnit } from '../../source/source-unit.js';
import type { ReferenceScanner } from '../reference-scanner.js';

export class ReturnTypeReferenceScanner implements ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const declaration of source.getClasses()) {
      for (const method of declaration.methods) {
        const symbolId = method.returnType.symbolId;

        if (!symbolId) {
          continue;
        }

        edges.push({
          from: declaration.symbolId,
          to: symbolId,
          type: 'return-type',
        });
      }
    }

    return edges;
  }
}
