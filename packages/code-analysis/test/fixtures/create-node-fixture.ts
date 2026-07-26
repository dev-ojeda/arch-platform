import type { SymbolNode } from '../../src/symbols/graph/symbol-graph-types.js';

export function createNode(id: string, packageName: string): SymbolNode {
  return {
    id,
    name: id,
    kind: 'class',
    sourceFile: `${id}.ts`,
    package: packageName,
    exported: true,
  };
}
