// packages/code-analysis/src/public/symbol-graph-query.ts

import type { SymbolEdge } from './symbol-edge.js';
import type { SymbolGraph } from './symbol-graph.js';
import type { SymbolNode } from './symbol-node.js';

export class SymbolGraphQuery {
  private readonly nodes: ReadonlyMap<string, SymbolNode>;

  private readonly nodesBySourceFile = new Map<string, SymbolNode[]>();

  private readonly incoming = new Map<string, SymbolEdge[]>();
  private readonly outgoing = new Map<string, SymbolEdge[]>();

  constructor(private readonly graph: SymbolGraph) {
    this.nodes = new Map(graph.nodes.map((node) => [node.id, node]));

    for (const node of graph.nodes) {
      const nodes = this.nodesBySourceFile.get(node.sourceFile);

      if (nodes) {
        nodes.push(node);
      } else {
        this.nodesBySourceFile.set(node.sourceFile, [node]);
      }
    }

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
  getNodesBySourceFile(sourceFile: string): readonly SymbolNode[] {
    return this.nodesBySourceFile.get(sourceFile) ?? [];
  }
  getEdges(): readonly SymbolEdge[] {
    return this.graph.edges;
  }
  getImportEdges(): readonly SymbolEdge[] {
    return this.graph.edges.filter((edge) => edge.type === 'import');
  }
  getExportEdges(): readonly SymbolEdge[] {
    return this.graph.edges.filter((edge) => edge.type === 'export');
  }
  validate(): readonly SymbolEdge[] {
    return this.graph.edges.filter(
      (edge) => (!this.nodes.has(edge.from) || !this.nodes.has(edge.to)) && edge.type === 'import',
    );
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
