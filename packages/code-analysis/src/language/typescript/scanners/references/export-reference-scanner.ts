// packages/code-analysis/src/language/typescript/scanners/references/export-reference-scanner.ts

import type { SymbolEdge } from '../../../../public/symbol-edge.js';
import type { SourceUnit } from '../../source/source-unit.js';
import type { ReferenceScanner } from '../reference-scanner.js';

export class ExportReferenceScanner implements ReferenceScanner {
  scan(source: SourceUnit): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const exported of source.getExports()) {
      for (const symbol of exported.symbols) {
        edges.push({
          from: source.path,
          to: symbol.id,
          type: 'export',
          metadata: {
            kind: symbol.symbolKind,
            isTypeOnly: symbol.isTypeOnlyExport,
            moduleSpecifier: exported.moduleSpecifier,
            resolvedFile: exported.resolvedFile,
          },
        });
      }
    }

    return edges;
  }
}
