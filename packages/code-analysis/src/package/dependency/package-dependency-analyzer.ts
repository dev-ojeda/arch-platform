// packages/code-analysis/src/package/dependency/package-dependency-analyzer.ts

import type { SymbolGraph } from '../../graph/symbol-graph-types.js';

import type { PackageDependencyGraphBuilder } from './package-dependency-graph-builder.js';
import type { PackageDependencyGraph } from './package-dependency-graph.js';

export class PackageDependencyAnalyzer {
  constructor(private readonly graphBuilder: PackageDependencyGraphBuilder) {}

  analyze(symbolGraph: SymbolGraph): PackageDependencyGraph {
    return this.graphBuilder.build(symbolGraph);
  }
}
