// packages/code-analysis/src/symbol-graph/symbol-graph-types.ts

import type { SymbolDefinition } from '../symbols/symbol-types.js';

import type { SymbolGraphEdge } from './symbol-edge-types.js';

export interface SymbolGraph {
  readonly nodes: readonly SymbolDefinition[];

  readonly edges: readonly SymbolGraphEdge[];
}
