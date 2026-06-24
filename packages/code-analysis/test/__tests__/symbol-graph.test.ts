// packages/code-analysis/test/__tests__/symbol-graph.test.ts

import { describe, expect, it } from 'vitest';

import { buildSymbolGraph } from '../../src/symbol-graph/build-symbol-graph.js';
import type { SymbolDefinition } from '../../src/symbols/symbol-types.js';

describe('buildSymbolGraph', () => {
  const symbols: readonly SymbolDefinition[] = [
    {
      id: '/src/user.ts#UserService',
      name: 'UserService',
      kind: 'class',
      sourceFile: '/src/user.ts',
    },
    {
      id: '/src/user.ts#UserRepository',
      name: 'UserRepository',
      kind: 'interface',
      sourceFile: '/src/user.ts',
    },
    {
      id: '/src/create-user.ts#createUser',
      name: 'createUser',
      kind: 'function',
      sourceFile: '/src/create-user.ts',
    },
  ];

  const graph = buildSymbolGraph(symbols);

  it('should create graph nodes', () => {
    expect(graph.nodes).toHaveLength(3);
  });

  it('should create graph edges collection', () => {
    expect(Array.isArray(graph.edges)).toBe(true);
  });

  it('should only generate known symbol kinds', () => {
    const allowedKinds = new Set(['class', 'interface', 'function']);

    for (const node of graph.nodes) {
      expect(allowedKinds.has(node.kind)).toBe(true);
    }
  });
});
