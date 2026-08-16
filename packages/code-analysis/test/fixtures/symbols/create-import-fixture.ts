// packages\code-analysis\test\fixtures\symbols\create-import-fixture.ts

import type { SymbolEdge } from '../../../src/graph/symbol-edge.js';

export function createImport(
  from: string,
  to: string,
  overrides: Partial<SymbolEdge> = {},
): SymbolEdge {
  return {
    from,
    to,
    type: 'import',
    ...overrides,
  };
}
