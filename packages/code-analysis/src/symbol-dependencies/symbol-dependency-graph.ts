// packages/code-analysis/src/symbol-dependencies/symbol-dependency-graph.ts

import type { SymbolEdge } from '../symbol-graph/symbol-edge-types.js';
import type { SymbolGraph } from '../symbol-graph/symbol-graph-types.js';

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
