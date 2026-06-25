// packages/code-analysis/src/impact/impact-analyzer.ts

import type { SymbolDependencyGraph } from '../symbol-dependencies/symbol-dependency-graph.js';

import type { ImpactResult } from './impact-result.js';

export class ImpactAnalyzer {
  constructor(private readonly dependencyGraph: SymbolDependencyGraph) {}

  analyze(
    symbolId: string,
    options: {
      maxDepth?: number;
    } = {},
  ): ImpactResult {
    const maxDepth = options.maxDepth ?? Infinity;

    const affectedSymbols = new Set<string>();
    const affectedPackages = new Set<string>();
    const affectedFiles = new Set<string>();

    const visited = new Set<string>();

    this.traverse(symbolId, 0, maxDepth, visited, affectedSymbols, affectedPackages, affectedFiles);

    return {
      symbolId,

      affectedSymbols: [...affectedSymbols],

      affectedPackages: [...affectedPackages],

      affectedFiles: [...affectedFiles],

      depth: this.calculateDepth(visited),
    };
  }

  private traverse(
    symbolId: string,
    depth: number,
    maxDepth: number,
    visited: Set<string>,
    symbols: Set<string>,
    packages: Set<string>,
    files: Set<string>,
  ): void {
    if (visited.has(symbolId) || depth >= maxDepth) {
      return;
    }

    visited.add(symbolId);

    const dependents = this.dependencyGraph.getDependents(symbolId);

    for (const edge of dependents) {
      const node = this.dependencyGraph.getNode(edge.from);

      if (!node) {
        continue;
      }

      symbols.add(node.id);
      packages.add(node.package);
      files.add(node.sourceFile);

      this.traverse(node.id, depth + 1, maxDepth, visited, symbols, packages, files);
    }
  }

  private calculateDepth(visited: Set<string>): number {
    return visited.size;
  }
}
