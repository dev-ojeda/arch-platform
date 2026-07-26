// packages/code-analysis/test/unit/architecture/no-circular-dependencies.rule.test.ts

import { describe, expect, it } from 'vitest';

import { NoCircularDependenciesRule } from '../../../src/architecture/rules/no-circular-dependencies.rule.js';
import { createImport } from '../../fixtures/create-import-fixture.js';
import { createNode } from '../../fixtures/create-node-fixture.js';
import { createSymbolGraph } from '../../fixtures/create-symbol-graph-fixture.js';

describe('NoCircularDependenciesRule', () => {
  it('should detect circular package dependency', () => {
    const graph = createSymbolGraph({
      nodes: [createNode('a', '@arch/a'), createNode('b', '@arch/b')],
      edges: [createImport('a', 'b'), createImport('b', 'a')],
    });

    const rule = new NoCircularDependenciesRule();

    const result = rule.validate(graph);

    expect(result.passed).toBe(false);
    expect(result.violations).toHaveLength(1);
    expect(result.violations[0].message).toContain('Circular dependency');
  });

  it('should pass acyclic dependency graph', () => {
    const graph = createSymbolGraph({
      nodes: [createNode('a', '@arch/a'), createNode('b', '@arch/b')],
      edges: [createImport('a', 'b')],
    });

    const rule = new NoCircularDependenciesRule();

    const result = rule.validate(graph);

    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });
});
