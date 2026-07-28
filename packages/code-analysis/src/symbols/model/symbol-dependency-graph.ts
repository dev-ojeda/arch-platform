// packages/code-analysis/src/symbols/model/symbol-dependency-graph.ts

import type { SymbolGraph } from '../graph/symbol-graph-types.js';

import type { SymbolEdge } from './symbol-edge-types.js';

export class SymbolDependencyGraph {
  constructor(private readonly graph: SymbolGraph) {}

  getDependents(symbolId: string): readonly SymbolEdge[] {
    return this.graph.edges.filter((edge) => edge.to === symbolId);
  }

  getDependencies(symbolId: string): readonly SymbolEdge[] {
    return this.graph.edges.filter((edge) => edge.from === symbolId);
  }

  getNode(symbolId: string) {
    return this.graph.nodes.find((node) => node.id === symbolId);
  }
}
