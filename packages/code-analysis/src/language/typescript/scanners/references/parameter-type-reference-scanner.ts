// packages/code-analysis/src/language/typescript/scanners/references/parameter-type-reference-scanner.ts

import type { SymbolEdge } from '../../../../graph/model/symbol-edge.js';
import type { SourceUnit } from '../../source/source-unit.js';
import type { ReferenceScanner } from '../reference-scanner.js';

export class ParameterTypeReferenceScanner implements ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const declaration of source.getClasses()) {
      if (!declaration.symbolId) {
        continue;
      }
      for (const method of declaration.methods) {
        for (const parameter of method.parameters) {
          const symbolId = parameter.type.symbolId;
          if (!symbolId) {
            continue;
          }

          edges.push({
            from: declaration.symbolId,
            to: symbolId,
            type: 'parameter-type',
          });
        }
      }
    }

    return edges;
  }
}
