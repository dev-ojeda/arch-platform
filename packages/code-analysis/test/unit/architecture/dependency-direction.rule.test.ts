// packages/code-analysis/test/unit/architecture/dependency-direction.rule.test.ts

import { describe, expect, it } from 'vitest';

import { DependencyDirectionRule } from '../../../src/architecture/rules/dependency-direction.rule.js';
import type { SymbolGraph } from '../../../src/symbol-graph/symbol-graph-types.js';

describe('DependencyDirectionRule', () => {
  it('should allow dependencies that follow the layer direction', () => {
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
          id: 'application-service',
          name: 'ApplicationService',
          kind: 'class',
          sourceFile: 'application.ts',
          package: '@arch/application',
          exported: true,
        },
        {
          id: 'domain-service',
          name: 'DomainService',
          kind: 'class',
          sourceFile: 'domain.ts',
          package: '@arch/domain',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'api-controller',
          to: 'application-service',
          type: 'import',
          kind: 'import',
        },
        {
          from: 'application-service',
          to: 'domain-service',
          type: 'import',
          kind: 'import',
        },
      ],
    };

    const rule = new DependencyDirectionRule({
      layers: ['@arch/api', '@arch/application', '@arch/domain'],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('should reject dependencies that violate the layer direction', () => {
    const graph: SymbolGraph = {
      nodes: [
        {
          id: 'domain-service',
          name: 'DomainService',
          kind: 'class',
          sourceFile: 'domain.ts',
          package: '@arch/domain',
          exported: true,
        },
        {
          id: 'application-service',
          name: 'ApplicationService',
          kind: 'class',
          sourceFile: 'application.ts',
          package: '@arch/application',
          exported: true,
        },
      ],

      edges: [
        {
          from: 'domain-service',
          to: 'application-service',
          type: 'import',
          kind: 'import',
        },
      ],
    };

    const rule = new DependencyDirectionRule({
      layers: ['@arch/api', '@arch/application', '@arch/domain'],
    });

    const result = rule.validate(graph);

    expect(result.passed).toBe(false);

    expect(result.violations).toHaveLength(1);

    expect(result.violations[0]).toMatchObject({
      fromPackage: '@arch/domain',
      toPackage: '@arch/application',
    });

    expect(result.violations[0].message).toContain('Dependency direction violation');
  });
});
