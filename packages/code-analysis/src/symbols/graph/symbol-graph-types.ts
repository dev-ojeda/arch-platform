// packages/code-analysis/src/symbols/graph/symbol-graph-types.ts

import type { SymbolEdge } from '../model/symbol-edge-types.js';
import type { SymbolDefinition } from '../model/symbol-types.js';

export interface SymbolNode extends SymbolDefinition {
  readonly package: string;
  readonly exported: boolean;
}

export interface SymbolGraph {
  readonly nodes: readonly SymbolNode[];

  readonly edges: readonly SymbolEdge[];
}
