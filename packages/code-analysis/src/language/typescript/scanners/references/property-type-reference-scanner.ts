// packages/code-analysis/src/language/typescript/scanners/references/property-type-reference-scanner.ts

import type { SymbolEdge } from '../../../../public/symbol-edge.js';
import type { SourceUnit } from '../../source/source-unit.js';
import type { ReferenceScanner } from '../reference-scanner.js';

export class PropertyTypeReferenceScanner implements ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const declaration of source.getClasses()) {
      for (const property of declaration.properties) {
        if (!property.type.symbolId) continue;

        edges.push({
          from: declaration.symbolId,
          to: property.type.symbolId,
          type: 'property-type',
        });
      }
    }

    return edges;
  }
}
