// packages\code-analysis\test\fixtures\symbols\create-node-fixture.ts

import type { SymbolNode } from '@arch/code-analysis';

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
