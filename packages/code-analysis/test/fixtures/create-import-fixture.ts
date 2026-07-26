import type { SymbolEdge } from '../../src/symbols/model/symbol-edge-types.js';

export function createImport(from: string, to: string): SymbolEdge {
  return {
    from,
    to,
    type: 'import',
  };
}
