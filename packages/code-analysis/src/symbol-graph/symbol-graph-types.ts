// packages/code-analysis/src/symbol-graph/symbol-graph-types.ts

import type { SymbolDefinition } from '../symbols/symbol-types.js';

export type SymbolGraphNode = SymbolDefinition;

export interface SymbolGraphEdge {
  readonly from: string;
  readonly to: string;
  readonly kind: string;
}

export interface SymbolGraph {
  readonly nodes: readonly SymbolGraphNode[];
  readonly edges: readonly SymbolGraphEdge[];
}
