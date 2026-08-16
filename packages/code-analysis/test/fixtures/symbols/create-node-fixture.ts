// packages\code-analysis\test\fixtures\symbols\create-node-fixture.ts

import type { SymbolNode } from '../../../src/graph/symbol-node.js';

export function createNode(
  id: string,
  packageName: string,
  overrides: Partial<SymbolNode> = {},
): SymbolNode {
  return {
    id,
    name: id,
    kind: 'class',
    sourceFile: `${id}.ts`,
    package: packageName,
    ...overrides,
  };
}
