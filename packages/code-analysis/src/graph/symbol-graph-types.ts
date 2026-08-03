// packages/code-analysis/src/symbols/graph/symbol-graph-types.ts

import type { SymbolDefinition } from '../language/typescript/scanners/symbols/model/symbol-types.js';

import type { SymbolEdge } from './model/symbol-edge.js';

export interface SymbolNode extends SymbolDefinition {
  readonly package: string;
}

export interface SymbolGraph {
  readonly nodes: readonly SymbolNode[];

  readonly edges: readonly SymbolEdge[];
}
