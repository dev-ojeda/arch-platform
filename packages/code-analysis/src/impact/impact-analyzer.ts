// packages/code-analysis/src/impact/impact-analyzer.ts

import type { SymbolDependencyGraph } from '../symbol-dependencies/symbol-dependency-graph.js';

import type { ImpactResult } from './impact-result.js';

export class ImpactAnalyzer {
  constructor(private readonly dependencyGraph: SymbolDependencyGraph) {}

  analyze(symbolId: string): ImpactResult {
    const edges = this.dependencyGraph.getDependents(symbolId);

    const affectedSymbols = edges.map((edge) => edge.from);

    const affectedPackages = affectedSymbols
      .map((id) => this.dependencyGraph.getNode(id))
      .filter(Boolean)
      .map((node) => node!.package);

    const affectedFiles = affectedSymbols
      .map((id) => this.dependencyGraph.getNode(id))
      .filter(Boolean)
      .map((node) => node!.sourceFile);

    return {
      symbolId,

      affectedSymbols: [...new Set(affectedSymbols)],

      affectedPackages: [...new Set(affectedPackages)],

      affectedFiles: [...new Set(affectedFiles)],

      depth: 1,
    };
  }
}
