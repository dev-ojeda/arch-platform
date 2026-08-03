// packages/code-analysis/src/impact/impact-analyzer.ts

import type { SymbolGraphQuery } from '../graph/symbol-graph-query.js';

import type { ImpactResult } from './impact-result.js';

export class ImpactAnalyzer {
  constructor(private readonly symbolGraphQuery: SymbolGraphQuery) {}

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
      affectedSymbols: Array.from(affectedSymbols),
      affectedPackages: Array.from(affectedPackages),
      affectedFiles: Array.from(affectedFiles),
      depth: this.calculateImpactSize(visited),
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
    if (visited.has(symbolId) || depth > maxDepth) {
      return;
    }

    visited.add(symbolId);

    const incomingEdges = this.symbolGraphQuery.getIncomingEdges(symbolId);

    for (const edge of incomingEdges) {
      const dependent = this.symbolGraphQuery.getNode(edge.from);

      if (!dependent) {
        continue;
      }

      symbols.add(dependent.id);
      packages.add(dependent.package);
      files.add(dependent.sourceFile);

      this.traverse(dependent.id, depth + 1, maxDepth, visited, symbols, packages, files);
    }
  }

  private calculateImpactSize(visited: Set<string>): number {
    return visited.size;
  }
}
