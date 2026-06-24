// packages/code-analysis/src/symbol-graph/build-symbol-graph.ts

import type { SymbolDefinition } from '../symbols/symbol-types.js';

import type { SymbolGraph } from './symbol-graph-types.js';

export function buildSymbolGraph(symbols: readonly SymbolDefinition[]): SymbolGraph {
  return {
    nodes: [...symbols],
    edges: [],
  };
}
