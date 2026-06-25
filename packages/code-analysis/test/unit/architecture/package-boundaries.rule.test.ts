// packages/code-analysis/test/unit/architecture/package-boundaries.rule.test.ts

import { describe, expect, it } from 'vitest';

import { PackageBoundariesRule } from '../../../src/architecture/rules/package-boundaries.rule.js';
import type { SymbolGraph } from '../../../src/symbol-graph/symbol-graph-types.js';

describe('PackageBoundariesRule', () => {
  it('should allow valid package dependency', () => {
    const graph: SymbolGraph = {
      nodes: [
        {
          id: 'api-controller',
          name: 'ApiController',
          kind: 'class',
          sourceFile: 'api.ts',
          package: '@arch/api',
          exported: true,
        },
        {
          id: 'app-service',
          name: 'ApplicationService',
          kind: 'class',
          sourceFile: 'service.ts',
          package: '@arch/application',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'api-controller',
          to: 'app-service',
          type: 'import',
          kind: 'import',
        },
      ],
    };

    const rule = new PackageBoundariesRule({
      '@arch/api': ['@arch/application'],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(true);

    expect(result.violations).toHaveLength(0);
  });

  it('should reject forbidden package dependency', () => {
    const graph: SymbolGraph = {
      nodes: [
        {
          id: 'domain-model',
          name: 'DomainModel',
          kind: 'class',
          sourceFile: 'domain.ts',
          package: '@arch/domain',
          exported: true,
        },
        {
          id: 'infra-db',
          name: 'DatabaseAdapter',
          kind: 'class',
          sourceFile: 'db.ts',
          package: '@arch/infrastructure',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'domain-model',
          to: 'infra-db',
          type: 'import',
          kind: 'import',
        },
      ],
    };

    const rule = new PackageBoundariesRule({
      '@arch/domain': [],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(false);

    expect(result.violations).toHaveLength(1);

    expect(result.violations[0].fromPackage).toBe('@arch/domain');

    expect(result.violations[0].toPackage).toBe('@arch/infrastructure');
  });
});
