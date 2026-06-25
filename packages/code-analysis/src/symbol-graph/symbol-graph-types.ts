// packages/code-analysis/src/symbol-graph/symbol-graph-types.ts

import type { SymbolDefinition } from '../symbols/symbol-types.js';

import type { SymbolEdge } from './symbol-edge-types.js';

export interface SymbolNode extends SymbolDefinition {
  readonly package: string;

  readonly exported: boolean;
}

export interface SymbolGraph {
  readonly nodes: readonly SymbolNode[];

  readonly edges: readonly SymbolEdge[];
}
