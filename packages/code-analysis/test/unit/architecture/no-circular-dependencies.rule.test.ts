// packages/code-analysis/test/unit/architecture/no-circular-dependencies.rule.test.ts

import { describe, expect, it } from 'vitest';

import { NoCircularDependenciesRule } from '../../../src/architecture/rules/no-circular-dependencies.rule.js';
import type { SymbolGraph } from '../../../src/symbol-graph/symbol-graph-types.js';

describe('NoCircularDependenciesRule', () => {
  it('should detect circular package dependency', () => {
    const graph: SymbolGraph = {
      nodes: [
        {
          id: 'a',
          name: 'A',
          kind: 'class',
          sourceFile: 'a.ts',
          package: '@arch/a',
          exported: true,
        },
        {
          id: 'b',
          name: 'B',
          kind: 'class',
          sourceFile: 'b.ts',
          package: '@arch/b',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'a',
          to: 'b',
          type: 'import',
          kind: 'import',
        },
        {
          from: 'b',
          to: 'a',
          type: 'import',
          kind: 'import',
        },
      ],
    };

    const rule = new NoCircularDependenciesRule();

    const result = rule.validate(graph);

    expect(result.passed).toBe(false);

    expect(result.violations).toHaveLength(1);

    expect(result.violations[0].message).toContain('Circular dependency');
  });

  it('should pass acyclic dependency graph', () => {
    const graph: SymbolGraph = {
      nodes: [
        {
          id: 'a',
          name: 'A',
          kind: 'class',
          sourceFile: 'a.ts',
          package: '@arch/a',
          exported: true,
        },
        {
          id: 'b',
          name: 'B',
          kind: 'class',
          sourceFile: 'b.ts',
          package: '@arch/b',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'a',
          to: 'b',
          type: 'import',
          kind: 'import',
        },
      ],
    };

    const rule = new NoCircularDependenciesRule();

    const result = rule.validate(graph);

    expect(result.passed).toBe(true);

    expect(result.violations).toHaveLength(0);
  });
});
