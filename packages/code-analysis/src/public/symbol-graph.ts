// packages/code-analysis/src/public/symbol-graph.ts

import type { SymbolEdge } from './symbol-edge.js';
import type { SymbolNode } from './symbol-node.js';

export interface SymbolGraph {
  readonly nodes: readonly SymbolNode[];

  readonly edges: readonly SymbolEdge[];
}
