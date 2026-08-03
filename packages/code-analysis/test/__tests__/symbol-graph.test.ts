// packages/code-analysis/test/__tests__/symbol-graph.test.ts

import { describe, expect, it } from 'vitest';

import { createSymbolGraphFixture } from '../fixtures/graph/create-symbol-graph-fixture.js';

describe('buildSymbolGraph', () => {
  const graph = createSymbolGraphFixture(`
    export class UserService {}

    export interface User {
      id: string;
    }

    export function createUser(): User {
      return { id: '1' };
    }
  `);

  it('should create graph nodes', () => {
    expect(graph.nodes.length).toBeGreaterThan(0);
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
  it('should resolve package names', () => {
    expect(graph.nodes.every((node) => node.package.length > 0)).toBe(true);
  });
});
