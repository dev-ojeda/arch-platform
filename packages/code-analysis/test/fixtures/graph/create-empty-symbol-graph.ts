import type { SymbolGraph } from '../../../src/graph/symbol-graph-types.js';

export function createSymbolGraph(overrides: Partial<SymbolGraph> = {}): SymbolGraph {
  return {
    nodes: [],
    edges: [],
    ...overrides,
  };
}
