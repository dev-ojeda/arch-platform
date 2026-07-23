// packages\governance\test\__tests__\detect-cycles.test.ts
import { describe, expect, it } from 'vitest';

import { detectCycles } from '../../src/analysis/graph/detect-cycles.js';

describe('detectCycles', () => {
  it('returns no cycles for an acyclic graph', () => {
    const graph = new Map([
      ['@arch/a', ['@arch/b']],
      ['@arch/b', ['@arch/c']],
      ['@arch/c', []],
    ]);

    const result = detectCycles(graph);

    expect(result.hasCycle).toBe(false);
    expect(result.cycles).toEqual([]);
  });

  it('detects a simple cycle', () => {
    const graph = new Map([
      ['@arch/a', ['@arch/b']],
      ['@arch/b', ['@arch/c']],
      ['@arch/c', ['@arch/a']],
    ]);

    const result = detectCycles(graph);

    expect(result.hasCycle).toBe(true);

    expect(result.cycles).toHaveLength(1);

    expect(result.cycles[0]).toEqual(['@arch/a', '@arch/b', '@arch/c', '@arch/a']);
  });

  it('ignores dependencies that are not present in the graph', () => {
    const graph = new Map([['@arch/a', []]]);

    const result = detectCycles(graph);

    expect(result.hasCycle).toBe(false);
    expect(result.cycles).toEqual([]);
  });
});
