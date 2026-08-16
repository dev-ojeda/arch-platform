// packages\code-analysis\test\fixtures\graph\create-empty-symbol-graph.ts
import type { SymbolGraph } from '../../../src/graph/symbol-graph.js';

export function createSymbolGraph(overrides: Partial<SymbolGraph> = {}): SymbolGraph {
  return {
    nodes: [],
    edges: [],
    ...overrides,
  };
}
