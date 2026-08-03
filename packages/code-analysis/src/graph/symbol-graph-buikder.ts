// packages/code-analysis/src/symbols/graph/symbol-graph-buikder.ts

import type { ExportedSymbolIndex } from '../api-surface/exported-symbol-index.js';
import type { ReferenceAnalyzer } from '../language/typescript/scanners/reference-analyzer.js';
import type { SymbolScanner } from '../language/typescript/scanners/symbols/symbol-scanner.js';
import type { PackageResolver } from '../package/resolvers/package-resolver.js';

import type { SymbolGraph } from './symbol-graph-types.js';

export class SymbolGraphBuilder {
  constructor(
    private readonly symbolScanner: SymbolScanner,
    private readonly referenceAnalyzer: ReferenceAnalyzer,
    private readonly packageResolver: PackageResolver,
  ) {}

  build(exportedSymbols?: ExportedSymbolIndex): SymbolGraph {
    const definitions = this.symbolScanner.scan();

    const nodes = definitions.map((symbol) => ({
      ...symbol,
      package: this.packageResolver.resolveFromFile(symbol.sourceFile) ?? 'unknown',
      exported: exportedSymbols?.has(symbol.id),
    }));

    return {
      nodes,
      edges: this.referenceAnalyzer.analyze(),
    };
  }
}
