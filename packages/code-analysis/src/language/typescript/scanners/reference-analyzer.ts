// packages/code-analysis/src/language/typescript/scanners/reference-analyzer.ts

import type { SymbolEdge } from '../../../public/symbol-edge.js';
import type { SourceReader } from '../source/source-reader.js';

import type { ReferenceScanner } from './reference-scanner.js';

export class ReferenceAnalyzer {
  constructor(
    private readonly sourceReader: SourceReader,
    private readonly scanners: readonly ReferenceScanner[],
  ) {}

  analyze(): readonly SymbolEdge[] {
    const edges: SymbolEdge[] = [];

    for (const source of this.sourceReader.getSources()) {
      for (const scanner of this.scanners) {
        edges.push(...scanner.scan(source));
      }
    }

    return edges;
  }
}
