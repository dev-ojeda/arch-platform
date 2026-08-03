// packages/code-analysis/src/symbols/graph/symbol-graph-query.ts

import type { SymbolEdge } from './model/symbol-edge.js';
import type { SymbolGraph, SymbolNode } from './symbol-graph-types.js';

export class SymbolGraphQuery {
  private readonly nodes: ReadonlyMap<string, SymbolNode>;

  private readonly incoming = new Map<string, SymbolEdge[]>();

  private readonly outgoing = new Map<string, SymbolEdge[]>();

  constructor(private readonly graph: SymbolGraph) {
    this.nodes = new Map(graph.nodes.map((node) => [node.id, node]));

    for (const edge of graph.edges) {
      this.addEdge(this.incoming, edge.to, edge);
      this.addEdge(this.outgoing, edge.from, edge);
    }
  }

  getIncomingEdges(symbolId: string): readonly SymbolEdge[] {
    return this.incoming.get(symbolId) ?? [];
  }

  getOutgoingEdges(symbolId: string): readonly SymbolEdge[] {
    return this.outgoing.get(symbolId) ?? [];
  }

  getNode(symbolId: string): SymbolNode | undefined {
    return this.nodes.get(symbolId);
  }

  getNodes(): readonly SymbolNode[] {
    return this.graph.nodes;
  }

  getEdges(): readonly SymbolEdge[] {
    return this.graph.edges;
  }

  private addEdge(index: Map<string, SymbolEdge[]>, key: string, edge: SymbolEdge): void {
    const edges = index.get(key);

    if (edges) {
      edges.push(edge);
      return;
    }

    index.set(key, [edge]);
  }
}
